import os

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from reportlab.lib.pagesizes import A4, landscape

from io import BytesIO

from db.models import Image, ImageStat, ImageMetadata


class ReportService:

    @staticmethod
    async def generate_report(db: AsyncSession) -> BytesIO:

        pdfmetrics.registerFont(
            TTFont("DejaVuSans", os.getcwd() + "\\fonts\\DejaVuSans.ttf")
        )

        stmt = (
            select(
                Image.id,
                Image.title,
                Image.author,
                Image.url,

                ImageStat.likes,
                ImageStat.views,
                ImageStat.downloads,

                ImageMetadata.width,
                ImageMetadata.height,
            )
            .join(ImageStat, ImageStat.image_id == Image.id)
            .join(ImageMetadata, ImageMetadata.id == Image.id)
        )

        result = await db.execute(stmt)
        rows = result.all()

        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=landscape(A4)
        )

        styles = getSampleStyleSheet()

        title_style = styles["Title"]
        title_style.fontName = "DejaVuSans"

        elements = []

        # заголовок отчёта
        title = Paragraph(
            "Отчёт по изображениям",
            title_style
        )
        elements.append(title)
        elements.append(Spacer(1, 20))

        # заголовки
        data = [[
            "Название",
            "Автор",
            "URL",
            "Лайки",
            "Просмотры",
            "Скачивания",
            "Размер"
        ]]

        for row in rows:
            data.append([
                str(row.title),
                str(row.author),
                str(row.url),
                str(row.likes),
                str(row.views),
                str(row.downloads),
                f"{row.width}×{row.height}" if row.width and row.height else ""
            ])

        table = Table(data, repeatRows=1)

        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.darkgrey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),

            ("FONTNAME", (0, 0), (-1, -1), "DejaVuSans"),

            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),

            ("ALIGN", (0, 0), (-1, -1), "CENTER"),

            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ]))

        elements.append(table)

        doc.build(elements)

        buffer.seek(0)
        return buffer

from io import BytesIO
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from openpyxl import Workbook

from db.models import Image, ImageStat, ImageMetadata


class ExcelReportService:

    @staticmethod
    async def generate_images_report(db: AsyncSession) -> BytesIO:

        stmt = (
            select(
                Image.id,
                Image.title,
                Image.author,
                Image.url,

                ImageStat.likes,
                ImageStat.views,
                ImageStat.downloads,

                ImageMetadata.width,
                ImageMetadata.height,
            )
            .join(ImageStat, ImageStat.image_id == Image.id)
            .join(ImageMetadata, ImageMetadata.id == Image.id)
        )

        result = await db.execute(stmt)
        rows = result.all()

        wb = Workbook()
        ws = wb.active
        ws.title = "Images Report"

        # HEADER
        ws.append([
            "ID",
            "Title",
            "Author",
            "URL",
            "Likes",
            "Views",
            "Downloads",
            "Width",
            "Height",
        ])

        # DATA
        for r in rows:
            ws.append([
                r.id,
                r.title,
                r.author,
                r.url,
                r.likes,
                r.views,
                r.downloads,
                r.width,
                r.height,
            ])

        # немного автоширины колонок
        for column_cells in ws.columns:
            length = max(len(str(cell.value or "")) for cell in column_cells)
            ws.column_dimensions[column_cells[0].column_letter].width = min(length + 2, 40)

        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)

        return buffer