import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

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
    width: "25%", // Adjusted width to fit the new layout
    minWidth: 60,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#e0e0e0",
  },
});

const getFeedbackRemark = (percentage) => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Satisfactory";
  if (percentage >= 40) return "Bad";
  return "Very Bad";
};

const FeedbackPDFsamee = ({ analysisData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Feedback Analysis Report</Text>

        <Text style={styles.title}>Theory Subjects</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.tableCellHeader]}>
              <Text>Faculty Name</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellHeader]}>
              <Text>Branch</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellHeader]}>
              <Text>Average Percentage</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellHeader]}>
              <Text>Feedback Remark</Text>
            </View>
          </View>
          {analysisData.map((data, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{data.facultyName}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{data.branch}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{data.averagePercentage}%</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{getFeedbackRemark(data.averagePercentage)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default FeedbackPDFsamee;
