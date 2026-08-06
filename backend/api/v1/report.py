from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import *
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4, landscape

from io import BytesIO
from datetime import datetime, date
import os

from db.session import get_db
from db.models import Image, ImageTag, Tag, ImageMetadata, ImageStat
from services.report_service import ExcelReportService

router = APIRouter()


@router.get("/")
async def images_pdf(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    font_path = os.path.join(os.getcwd(), "fonts", "DejaVuSans.ttf")
    pdfmetrics.registerFont(TTFont("DejaVuSans", font_path))

    stmt = (
        select(
            Image.id,
            Image.title,
            Image.author,
            func.count(ImageTag.tag_id).label("tags_count")
        )
        .select_from(Image)
        .outerjoin(ImageTag, ImageTag.image_id == Image.id)
    )

    if date_from:
        stmt = stmt.where(func.date(ImageStat.createdAt) >= date_from)

    if date_to:
        stmt = stmt.where(func.date(ImageStat.createdAt) <= date_to)

    stmt = (
        stmt
        .group_by(
            Image.id,
            Image.title,
            Image.author,
        )
        .order_by(
            func.count(ImageTag.tag_id).desc()
        )
    )

    result = await db.execute(stmt)
    rows = result.all()

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))

    styles = getSampleStyleSheet()
    styles["Title"].fontName = "DejaVuSans"

    elements = []

    period = "За всё время"

    if date_from or date_to:
        period = f"{date_from or '...'} - {date_to or '...'}"

    title = Paragraph(
        f"""
        Отчёт по изображениям<br/>
        Период: {period}<br/>
        Дата формирования: {datetime.now().strftime('%d.%m.%Y %H:%M')}
        """,
        styles["Title"]
    )

    elements.append(title)
    elements.append(Spacer(1, 20))

    data = [["ID", "Название", "Автор", "Кол-во тегов"]]

    for r in rows:
        data.append([
            str(r.id),
            str(r.title),
            str(r.author),
            str(r.tags_count or 0)
        ])

    table = Table(data)

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, -1), "DejaVuSans"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ]))

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline; filename=images_report.pdf"
        }
    )

@router.get("/authors")
async def authors_pdf(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: AsyncSession = Depends(get_db),
    ):
    font_path = os.path.join(
    os.getcwd(),
    "fonts",
    "DejaVuSans.ttf"
    )

    pdfmetrics.registerFont(
        TTFont(
            "DejaVuSans",
            font_path
        )
    )

    stmt = (
        select(
            Image.author,
            Image.id,
            Image.title,
            ImageStat.createdAt,
            ImageStat.views,
            ImageStat.likes,
            ImageStat.downloads,
        )
        .select_from(Image)
        .outerjoin(
            ImageStat,
            ImageStat.image_id == Image.id
        )
    )

    if date_from:
        stmt = stmt.where(
            func.date(ImageStat.createdAt) >= date_from
        )

    if date_to:
        stmt = stmt.where(
            func.date(ImageStat.createdAt) <= date_to
        )

    stmt = stmt.order_by(
        Image.author,
        ImageStat.createdAt.desc()
    )

    result = await db.execute(stmt)

    rows = result.all()

    grouped = {}

    for row in rows:
        grouped.setdefault(
            row.author or "Неизвестный автор",
            []
        ).append(row)

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4)
    )

    styles = getSampleStyleSheet()

    styles["Title"].fontName = "DejaVuSans"

    elements = []

    period = "За всё время"

    if date_from or date_to:
        period = f"{date_from or '...'} - {date_to or '...'}"

    elements.append(
        Paragraph(
            f"""
            Отчёт по авторам и изображениям<br/>
            Период: {period}<br/>
            Дата формирования:
            {datetime.now().strftime('%d.%m.%Y %H:%M')}
            """,
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    data = [[
        "ID",
        "Изображение",
        "Дата",
        "Просмотры",
        "Лайки",
        "Скачивания"
    ]]

    author_rows = []

    for author, images in grouped.items():

        author_row_index = len(data)

        data.append([
            f"Автор: {author} ({len(images)} изображений)",
            "",
            "",
            "",
            "",
            "",
        ])

        author_rows.append(author_row_index)

        for image in images:

            data.append([
                str(image.id),

                str(image.title),

                image.createdAt.strftime("%d.%m.%Y")
                if image.createdAt
                else "",

                str(image.views or 0),

                str(image.likes or 0),

                str(image.downloads or 0),
            ])

    table = Table(
        data,
        colWidths=[
            240,
            120,
            90,
            70,
            70,
            90,
        ]
    )

    style = [
        ("FONTNAME", (0, 0), (-1, -1), "DejaVuSans"),

        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),

        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),

        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),

        ("ALIGN", (0, 0), (-1, 0), "CENTER"),

        ("ALIGN", (0, 1), (-1, -1), "LEFT"),

        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]

    for row_index in author_rows:

        style.extend([
            (
                "BACKGROUND",
                (0, row_index),
                (5, row_index),
                colors.lightgrey
            ),
            (
                "SPAN",
                (0, row_index),
                (5, row_index)
            ),
            (
                "ALIGN",
                (0, row_index),
                (5, row_index),
                "LEFT"
            ),
            (
                "LEFTPADDING",
                (0, row_index),
                (5, row_index),
                8
            ),
        ])

    table.setStyle(
        TableStyle(style)
    )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "inline; filename=authors_report.pdf"
        }
    )

@router.get("/tags")
async def tags_pdf(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    font_path = os.path.join(os.getcwd(), "fonts", "DejaVuSans.ttf")
    pdfmetrics.registerFont(TTFont("DejaVuSans", font_path))

    stmt = (
        select(
            Tag.id,
            Tag.name,
            Tag.color,
            func.count(ImageTag.image_id).label("images_count")
        )
        .select_from(Tag)
        .outerjoin(ImageTag, ImageTag.tag_id == Tag.id)
        .outerjoin(Image, Image.id == ImageTag.image_id)
    )

    if date_from:
        stmt = stmt.where(func.date(Image.createdAt) >= date_from)

    if date_to:
        stmt = stmt.where(func.date(Image.createdAt) <= date_to)

    stmt = (
        stmt
        .group_by(
            Tag.id,
            Tag.name,
            Tag.color,
        )
        .order_by(
            func.count(ImageTag.image_id).desc()
        )
    )

    result = await db.execute(stmt)
    rows = result.all()

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)

    styles = getSampleStyleSheet()
    styles["Title"].fontName = "DejaVuSans"

    elements = []

    period = "За всё время"

    if date_from or date_to:
        period = f"{date_from or '...'} - {date_to or '...'}"

    title = Paragraph(
        f"""
        Отчёт по тегам<br/>
        Период: {period}<br/>
        Дата формирования: {datetime.now().strftime('%d.%m.%Y %H:%M')}
        """,
        styles["Title"]
    )

    elements.append(title)
    elements.append(Spacer(1, 20))

    data = [["ID", "Название", "Цвет", "Кол-во изображений"]]

    for r in rows:
        data.append([
            str(r.id),
            str(r.name),
            str(r.color),
            str(r.images_count or 0)
        ])

    table = Table(data)

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, -1), "DejaVuSans"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline; filename=tags_report.pdf"
        }
    )

@router.get("/tags-images")
async def tags_images_pdf(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: AsyncSession = Depends(get_db),
    ):
    font_path = os.path.join(
    os.getcwd(),
    "fonts",
    "DejaVuSans.ttf"
    )

    pdfmetrics.registerFont(
        TTFont(
            "DejaVuSans",
            font_path
        )
    )

    stmt = (
        select(
            Tag.name.label("tag_name"),

            Image.id.label("image_id"),
            Image.title,
            Image.author,

            ImageStat.createdAt,
            ImageStat.views,
            ImageStat.likes,
            ImageStat.downloads,
        )
        .select_from(Tag)
        .outerjoin(
            ImageTag,
            ImageTag.tag_id == Tag.id
        )
        .outerjoin(
            Image,
            Image.id == ImageTag.image_id
        )
        .outerjoin(
            ImageStat,
            ImageStat.image_id == Image.id
        )
    )

    if date_from:
        stmt = stmt.where(
            func.date(ImageStat.createdAt) >= date_from
        )

    if date_to:
        stmt = stmt.where(
            func.date(ImageStat.createdAt) <= date_to
        )

    stmt = stmt.order_by(
        Tag.name,
        Image.title
    )

    result = await db.execute(stmt)

    rows = result.all()

    grouped = {}

    for row in rows:

        tag_name = row.tag_name or "Без тега"

        if tag_name not in grouped:
            grouped[tag_name] = []

        if row.image_id:
            grouped[tag_name].append(row)

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4)
    )

    styles = getSampleStyleSheet()

    styles["Title"].fontName = "DejaVuSans"

    elements = []

    period = "За всё время"

    if date_from or date_to:
        period = f"{date_from or '...'} - {date_to or '...'}"

    elements.append(
        Paragraph(
            f"""
            Отчёт по тегам и изображениям<br/>
            Период: {period}<br/>
            Дата формирования:
            {datetime.now().strftime('%d.%m.%Y %H:%M')}
            """,
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    data = [[
        "ID",
        "Название",
        "Автор",
        "Дата",
        "Просмотры",
        "Лайки",
        "Скачивания"
    ]]

    tag_rows = []

    for tag_name, images in grouped.items():

        tag_row_index = len(data)

        data.append([
            f"Тег: {tag_name} ({len(images)} изображений)",
            "",
            "",
            "",
            "",
            "",
            "",
        ])

        tag_rows.append(tag_row_index)

        for image in images:

            data.append([
                str(image.image_id),

                str(image.title),

                str(image.author),

                image.createdAt.strftime("%d.%m.%Y")
                if image.createdAt
                else "",

                str(image.views or 0),

                str(image.likes or 0),

                str(image.downloads or 0),
            ])

    table = Table(
        data,
        colWidths=[
            230,  # ID
            120,  # Название
            140,  # Автор
            90,   # Дата
            70,   # Просмотры
            70,   # Лайки
            90,   # Скачивания
        ]
    )

    style = [
        ("FONTNAME", (0, 0), (-1, -1), "DejaVuSans"),

        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),

        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),

        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),

        ("ALIGN", (0, 0), (-1, 0), "CENTER"),

        ("ALIGN", (0, 1), (-1, -1), "LEFT"),

        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]

    for row_index in tag_rows:

        style.extend([
            (
                "BACKGROUND",
                (0, row_index),
                (6, row_index),
                colors.lightgrey
            ),
            (
                "SPAN",
                (0, row_index),
                (6, row_index)
            ),
            (
                "ALIGN",
                (0, row_index),
                (6, row_index),
                "LEFT"
            ),
            (
                "LEFTPADDING",
                (0, row_index),
                (6, row_index),
                8
            ),
        ])

    table.setStyle(
        TableStyle(style)
    )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "inline; filename=tags_images_report.pdf"
        }
    )





@router.get("/excel")
async def export_images_excel(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    file_buffer = await ExcelReportService.generate_images_report(
        db=db,
        date_from=date_from,
        date_to=date_to,
    )

    return StreamingResponse(
        file_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=images_report.xlsx"
        }
    )