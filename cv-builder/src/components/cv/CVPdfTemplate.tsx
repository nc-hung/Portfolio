import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Đăng ký Font Roboto hỗ trợ Tiếng Việt
const isServer = typeof window === 'undefined';

// TRICK: On server side (NodeJS), reading từ FS và chuyển sang Base64 là ổn định nhất
const getFontSource = (name: string): any => {
  const cdnUrl = `https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/${name}.ttf`;

  if (isServer) {
    try {
      const fs = require('fs');
      const path = require('path');
      const p = path.join(process.cwd(), 'public/fonts', `${name}.ttf`);
      if (fs.existsSync(p)) {
        const buffer = fs.readFileSync(p);
        return `data:font/ttf;base64,${buffer.toString('base64')}`; 
      }
      return cdnUrl;
    } catch (e) {
      return cdnUrl;
    }
  }
  return cdnUrl; 
};

Font.register({
  family: 'Roboto',
  fonts: [
    { src: getFontSource('Roboto-Regular') },
    { src: getFontSource('Roboto-Bold'), fontWeight: 'bold' }
  ]
});

type TemplateConfig = {
  columns: number;
  colorScheme: { primary: string; secondary: string; background: string };
  typography: { nameSize: number; titleSize: number; sectionHeaderSize: number; bodySize: number };
  sectionOrder: string[];
  margins: { top: number; right: number; bottom: number; left: number };
};

const defaultLayoutConfig: TemplateConfig = {
  columns: 1,
  colorScheme: { primary: '#007bff', secondary: '#333333', background: '#ffffff' },
  typography: { nameSize: 24, titleSize: 14, sectionHeaderSize: 12, bodySize: 10 },
  sectionOrder: ['summary', 'skills', 'experience', 'education', 'achievements'],
  margins: { top: 40, right: 40, bottom: 40, left: 40 }
};

export const CVPdfTemplate = ({ cvData, layoutConfig = defaultLayoutConfig }: { cvData: any, layoutConfig?: any }) => {
  const config = { ...defaultLayoutConfig, ...layoutConfig };

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: config.colorScheme.background,
      paddingTop: config.margins.top,
      paddingRight: config.margins.right,
      paddingBottom: config.margins.bottom,
      paddingLeft: config.margins.left,
      fontFamily: 'Roboto'
    },
    header: {
      marginBottom: 20
    },
    name: {
      fontSize: config.typography.nameSize,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 4,
    },
    title: {
      fontSize: 12,
      fontFamily: 'Roboto',
      color: '#3b82f6',
      fontWeight: 'bold',
      marginBottom: 8,
    },
    contact: {
      fontSize: 9,
      fontFamily: 'Roboto',
      color: '#64748b',
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '#1e293b',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      paddingBottom: 3,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    bodyText: {
      fontSize: config.typography.bodySize,
      fontFamily: 'Roboto',
      color: config.colorScheme.secondary,
      lineHeight: 1.5,
      marginBottom: 4
    },
    experienceItem: {
      marginBottom: 10
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4
    },
    companyRole: {
      fontSize: config.typography.bodySize,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: config.colorScheme.secondary
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    itemName: {
      fontSize: 11,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '#334155',
    },
    itemSub: {
      fontSize: 9,
      fontFamily: 'Roboto',
      color: '#64748b',
      fontStyle: 'italic',
    },
    itemDate: {
      fontSize: 9,
      fontFamily: 'Roboto',
      color: '#64748b',
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 4,
      paddingLeft: 10
    },
    bulletPointContainer: {
      flexDirection: 'row',
      marginBottom: 2,
      paddingLeft: 5,
    },
    bullet: {
      width: 10,
      fontSize: 10,
      fontFamily: 'Roboto',
    },
    bulletText: {
      flex: 1,
      fontSize: 9,
      fontFamily: 'Roboto',
      lineHeight: 1.4,
    },
    skillGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    skillBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      backgroundColor: '#f1f5f9',
      borderRadius: 4,
      fontSize: 8,
      fontFamily: 'Roboto',
      color: '#475569',
    }
  });

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return cvData.summary ? (
          <View style={styles.section} key={key}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.bodyText}>{cvData.summary}</Text>
          </View>
        ) : null;
      case 'skills':
        return cvData.skills && cvData.skills.length > 0 ? (
          <View style={styles.section} key={key}>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            {cvData.skills.map((skill: string, index: number) => (
              <View style={styles.bulletPoint} key={index}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case 'experience':
        return cvData.experience && cvData.experience.length > 0 ? (
          <View style={styles.section} key={key}>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE / PROJECTS</Text>
            {cvData.experience.map((exp: any, index: number) => (
              <View style={styles.experienceItem} key={index}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.companyRole}>{exp.companyOrProject} | {exp.role}</Text>
                </View>
                {exp.achievements?.map((achievement: string, idx: number) => (
                  <View style={styles.bulletPoint} key={idx}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null;
      case 'education':
        return cvData.education && cvData.education.length > 0 ? (
          <View style={styles.section} key={key}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {cvData.education.map((edu: string, index: number) => (
              <Text style={styles.bodyText} key={index}>{edu}</Text>
            ))}
          </View>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{cvData.personalInfo?.fullName || 'NGUYEN CONG HUNG'}</Text>
          <Text style={styles.title}>{cvData.targetJobTitle || 'SOFWARE ENGINEER'}</Text>
          <Text style={styles.contact}>
            {cvData.personalInfo?.email || 'chienthan0200@gmail.com'} | {cvData.personalInfo?.phone || '0379207086'} | {cvData.personalInfo?.location || 'District 7, Ho Chi Minh City'}
          </Text>
        </View>

        {/* Render sections sequentially according to layout config */}
        {config.sectionOrder.map((section: string) => renderSection(section))}

      </Page>
    </Document>
  );
};
