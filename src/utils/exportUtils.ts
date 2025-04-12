
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import { ProductCardProps } from "@/components/products/ProductCard";

/**
 * Available fields for export
 */
export type ExportField = {
  id: string;
  label: string;
  key: keyof ProductCardProps | ((product: ProductCardProps) => string);
};

export const EXPORT_FIELDS: ExportField[] = [
  { id: 'id', label: 'ID', key: 'id' },
  { id: 'name', label: 'Nom', key: 'name' },
  { id: 'description', label: 'Description', key: 'description' },
  { id: 'category', label: 'Catégorie', key: 'category' },
  { id: 'subcategory', label: 'Sous-catégorie', key: 'subcategory' },
  { id: 'partner', label: 'Partenaire', key: 'partner' },
  { id: 'pricing', label: 'Prix', key: 'pricing' },
  { id: 'tags', label: 'Tags', key: (product) => product.tags.join(', ') },
  { id: 'specs', label: 'Spécifications', key: (product) => product.specs ? product.specs.join('; ') : '' },
];

// Default fields to include if none selected
const DEFAULT_EXPORT_FIELDS = ['name', 'category', 'subcategory', 'pricing', 'description'];

/**
 * Get value from product based on field definition
 */
const getFieldValue = (product: ProductCardProps, field: ExportField): string => {
  if (typeof field.key === 'function') {
    return field.key(product);
  }
  
  const value = product[field.key];
  return value !== undefined ? String(value) : '';
};

/**
 * Format the products data for CSV export
 */
const formatProductsForCSV = (
  products: ProductCardProps[], 
  selectedFields: string[] = DEFAULT_EXPORT_FIELDS
): string => {
  // Get selected field definitions
  const fields = EXPORT_FIELDS.filter(field => selectedFields.includes(field.id));
  
  // CSV header
  const header = fields.map(field => field.label).join(',');
  let csv = header + '\n';
  
  // Add each product as a row
  products.forEach(product => {
    const row = fields.map(field => {
      const value = getFieldValue(product, field);
      // Escape quotes in CSV
      return `"${value.replace(/"/g, '""')}"`;
    });
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Export products to CSV
 */
export const exportProductsToCSV = (
  products: ProductCardProps[], 
  filename = "produits",
  selectedFields: string[] = DEFAULT_EXPORT_FIELDS
): void => {
  const csv = formatProductsForCSV(products, selectedFields);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download link
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate HTML for PDF export
 */
const generateProductListHTML = (
  products: ProductCardProps[],
  selectedFields: string[] = DEFAULT_EXPORT_FIELDS
): string => {
  // Get selected field definitions
  const fields = EXPORT_FIELDS.filter(field => selectedFields.includes(field.id));
  
  let html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #215db0; margin-bottom: 20px;">Catalogue Produits et Services</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #215db0; color: white;">
            ${fields.map(field => `<th style="padding: 8px; text-align: left; border: 1px solid #ddd;">${field.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  products.forEach((product, index) => {
    const rowStyle = index % 2 === 0 ? 'background-color: #f2f2f2;' : '';
    html += `
      <tr style="${rowStyle}">
        ${fields.map(field => {
          const value = getFieldValue(product, field);
          // For description, limit the length
          const displayValue = field.id === 'description' ? 
            `${value.substring(0, 100)}${value.length > 100 ? '...' : ''}` : 
            value;
          return `<td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${displayValue}</td>`;
        }).join('')}
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Catalogue généré le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
  `;

  return html;
};

/**
 * Export products to PDF
 */
export const exportProductsToPDF = (
  products: ProductCardProps[], 
  filename = "produits",
  selectedFields: string[] = DEFAULT_EXPORT_FIELDS
): void => {
  const html = generateProductListHTML(products, selectedFields);
  
  const opt = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };
  
  // Generate PDF
  html2pdf().set(opt).from(html).save();
};
