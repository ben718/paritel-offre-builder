
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import { ProductCardProps } from "@/components/products/ProductCard";

/**
 * Exports product list to various formats
 */

// Format the products data for CSV export
const formatProductsForCSV = (products: ProductCardProps[]): string => {
  // CSV header
  let csv = "ID,Nom,Description,Catégorie,Sous-catégorie,Partenaire,Prix,Tags\n";
  
  // Add each product as a row
  products.forEach(product => {
    const row = [
      product.id,
      `"${product.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
      `"${product.description.replace(/"/g, '""')}"`,
      `"${product.category}"`,
      `"${product.subcategory || ''}"`,
      `"${product.partner || ''}"`,
      `"${product.pricing || ''}"`,
      `"${product.tags.join(', ')}"`,
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

// Export products to CSV
export const exportProductsToCSV = (products: ProductCardProps[], filename = "produits"): void => {
  const csv = formatProductsForCSV(products);
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

// Generate HTML for PDF export
const generateProductListHTML = (products: ProductCardProps[]): string => {
  let html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #215db0; margin-bottom: 20px;">Catalogue Produits et Services</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #215db0; color: white;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Nom</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Catégorie</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Sous-catégorie</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Prix</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
          </tr>
        </thead>
        <tbody>
  `;

  products.forEach((product, index) => {
    const rowStyle = index % 2 === 0 ? 'background-color: #f2f2f2;' : '';
    html += `
      <tr style="${rowStyle}">
        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${product.name}</td>
        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${product.category}</td>
        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${product.subcategory || ''}</td>
        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${product.pricing || ''}</td>
        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</td>
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

// Export products to PDF
export const exportProductsToPDF = (products: ProductCardProps[], filename = "produits"): void => {
  const html = generateProductListHTML(products);
  
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
