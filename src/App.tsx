import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import EmailRedirect from './components/Body/components/Email/emailResult'
import PhotoCapture from './components/Body/components/capturePhoto/capturePhoto'
import QRScanner from './components/Body/components/scanner/qrscan'
import ScannerResult from './components/Body/components/scanner/qrscannerResult'
import { BodyWrapper } from './components/Body/styled'
// import PhotoResult from './components/Body/components/capturePhoto/PhotoResult'

function App() {
 

  return (
    <BrowserRouter>
      <Header />
      <BodyWrapper>
        <div className="h-[4.3rem] md:h-[5.5rem] bg-gray-700"></div>
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/email-redirect" element={<EmailRedirect />} />
          <Route path="/photo-capture" element={<PhotoCapture />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/scan-result" element={<ScannerResult />} />
        </Routes>

        <Footer />
      </BodyWrapper>
    </BrowserRouter>
  );
}

export default App
