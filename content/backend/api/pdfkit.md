---
id: pdfkit
name: "PDFKit (file generation)"
short: PDFKit
kind: library
status: learned
tags: [pdf, document-generation, streaming, invoices, nodejs]
what: "Streaming PDF document generation library for Node.js that creates complex, multi-page vector graphics, text layouts, and tables in PDF format."
why: "Enables server-side generation and immediate streaming of dynamic invoices, receipts, and reports directly to the client without saving intermediate files to disk."
problem: "Rendering PDFs via headless browsers (e.g. Puppeteer) consumes heavy CPU and RAM, making it unscalable for high-throughput batch invoice generation."
relations:
  - { to: "nodejs", label: "runs on" }
  - { to: "streams-buffers", label: "implements readable stream via" }
  - { to: "express", label: "streams dynamic pdfs in" }
links:
  - { title: "PDFKit Documentation", url: "https://pdfkit.org/" }
  - { title: "PDFKit GitHub", url: "https://github.com/foliojs/pdfkit" }
alsoIn: []
source: course
---

## Example
```js
import PDFDocument from "pdfkit";

export function generateInvoice(order, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="invoice-${order.id}.pdf"`);

  // Pipe directly to the HTTP response stream
  doc.pipe(res);

  doc.fontSize(20).text("Invoice", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: #${order.id}`);
  doc.text(`Customer: ${order.customerName}`);
  doc.text(`Total Amount: $${order.total.toFixed(2)}`);

  // Finalize the PDF stream
  doc.end();
}
```

## Key points
- **Streaming architecture**: `PDFDocument` is an instance of a Readable stream, enabling piped output (`doc.pipe(res)`) that streams bytes to clients as pages are generated.
- **Coordinate-based layout**: positioning operates on points (72 points per inch) with origin `(0,0)` at the top-left margin; helper methods like `doc.moveDown()` facilitate flowing text.
- **Mandatory `doc.end()`**: always call `doc.end()` when finished writing content; omitting it leaves the stream and the client HTTP connection open indefinitely.
