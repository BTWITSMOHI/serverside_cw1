export function downloadCSV(data, filename = "data.csv") {
    const rows = Array.isArray(data) ? data : [];
  
    if (rows.length === 0) {
      const blob = new Blob(["No data available"], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      URL.revokeObjectURL(url);
      return;
    }
  
    const headers = Object.keys(rows[0]);
  
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((field) => `"${row[field] ?? ""}"`).join(",")
      ),
    ];
  
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
  
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  
    URL.revokeObjectURL(url);
  }