import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // ✅ Must be after jsPDF

// ✅ Enhanced value formatter
const formatValue = (value) => {
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ") || "N/A";
    if (typeof value === "object" && value !== null) {
        // Try to show meaningful info for mongoose refs
        return value.rank || value.name || value._id || JSON.stringify(value);
    }
    return value ?? "N/A";
};

// ✅ Excel Export
export const exportToExcel = (data, fileName = "export", selectedFields = []) => {
    if (!data || data.length === 0) return alert("No data to export");

    const exportData = data.map((item) => {
        const obj = {};
        const fields = selectedFields.length > 0 ? selectedFields : Object.keys(item);
        fields.forEach((field) => {
            obj[field] = formatValue(item[field]);
        });
        return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `${fileName}_${date}.xlsx`);
};

// ✅ PDF Export
export const exportToPDF = (data, fileName = "export", selectedFields = []) => {
    if (!data || data.length === 0) return alert("No data to export");

    const doc = new jsPDF("p", "pt", "a4");
    const fields = selectedFields.length > 0 ? selectedFields : Object.keys(data[0]);
    const rows = data.map((item) => fields.map((field) => formatValue(item[field])));

    doc.autoTable({
        head: [fields],
        body: rows,
        startY: 30,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        didDrawPage: () => {
            doc.setFontSize(10);
            doc.text(`Exported: ${new Date().toLocaleString()}`, 40, 20);
        },
    });

    const date = new Date().toISOString().split("T")[0];
    doc.save(`${fileName}_${date}.pdf`);
};
