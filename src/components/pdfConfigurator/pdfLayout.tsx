import './pdf.css';
import RenderFromUnreal from './sampleImage.jpg';

function PdfLayout() {

  return (
    <div className="pdf-page">
      <div className="pdf-grid">
        <div className="pdf-row1">
            <section className="pdf-section red"></section>
        </div>
        <div className="pdf-row2">
            <section className="pdf-section green"></section>
            <section className="pdf-section blue" ><img className="imageFromUnreal" src={RenderFromUnreal} alt="render" /></section>
        </div>
      </div>
    </div>
  );
}

export default PdfLayout