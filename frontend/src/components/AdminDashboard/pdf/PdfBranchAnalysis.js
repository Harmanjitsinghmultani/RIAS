import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  branchName: {
    fontSize: 16, // Make it bold and slightly larger
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase", // Capitalize the heading
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    textAlign: "center",
    fontSize: 11,
    width: "20%", // Adjusted width for five columns
    minWidth: 60,
  },
  tableCellHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  averagesContainer: {
    marginTop: 20,
  },
  averageText: {
    textAlign: "center",
    fontSize: 12,
  },
});

// Create Document Component
const PdfBranchAnalysis = ({ analysisData, parentDepartment }) => {
  const getFeedbackRemark = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Satisfactory";
    return "Need Improvement";
  };

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Branch Feedback Analysis Report</Text>

        {/* Add a clear heading for the Parent Department */}
        <Text style={styles.branchName}>Department: {parentDepartment}</Text>

        <View style={styles.section}>
          <Text style={styles.title}>Analysis Data</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>
                Faculty Name
              </Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>
                Course Count
              </Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>
                Student Count
              </Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>
                Average Percentage
              </Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>
                Feedback Remark
              </Text>
            </View>
            {analysisData.map((data, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{data.facultyName}</Text>
                <Text style={styles.tableCell}>{data.courseCount}</Text>
                <Text style={styles.tableCell}>{data.studentCount}</Text>
                <Text style={styles.tableCell}>
                  {data.averagePercentage !== "0.00"
                    ? `${data.averagePercentage}%`
                    : "0%"}
                </Text>
                <Text style={styles.tableCell}>
                  {getFeedbackRemark(data.averagePercentage)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.averagesContainer}>
          <Text style={styles.averageText}>
            Total Records: {analysisData.length}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfBranchAnalysis;
