import React, { useState } from 'react';

const Index = () => {
  const [shades] = useState([
    "/Shades/1M_2.jpg",
    "/Shades/2L_1.5.jpg",
    "/Shades/2L_2.5.jpg",
    "/Shades/2M_1.jpg",
    "/Shades/2M_2.jpg",
    "/Shades/2M_3.jpg",
    "/Shades/2R_1.5.jpg",
    "/Shades/2R_2.5.jpg",
    "/Shades/3L_1.5.jpg",
    "/Shades/3L_2.5.jpg",
    "/Shades/3M_1.jpg",
    "/Shades/3M_2.jpg",
    "/Shades/3M_3.jpg",
    "/Shades/3R_2.5.jpg",
    "/Shades/4L_2.5.jpg",
    "/Shades/4M_1.jpg",
    "/Shades/4M_3.jpg"
  ]);
  
  const [currentShade, setCurrentShade] = useState("");
  const [showShade, setShowShade] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentShadeName, setCurrentShadeName] = useState("");

  const handlePredict = () => {
    setShowShade(true);
    let index = 0;
    const interval = setInterval(() => {
      setCurrentShade(shades[index]);
      setCurrentShadeName(shades[index].split("/").pop().replace(".jpg", ""));
      index++;
      if (index >= shades.length) {
        clearInterval(interval);
      }
    }, 200); // Change shades every 200ms
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
              <b>TOOTH TONE ANALYZER</b>
            </h1>
            <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
              <b>UPLOAD THE IMAGE</b>
            </h2>
            <input type="file" name="file" id="file" className="form-control mb-3" onChange={handleImageUpload} />
            <button className="btn btn-warning w-100" onClick={handlePredict}>
              <b>Predict the shade</b>
            </button>
            {selectedImage && showShade && (
              <div style={{ marginTop: "20px", textAlign: "center", display: "flex", justifyContent: "center", gap: "20px" }}>
                <div>
                  <img src={selectedImage} alt="Uploaded" style={{ width: "200px", height: "200px", border: "2px solid black" }} />
                </div>
                <div>
                  <img src={currentShade} alt="Predicted Shade" style={{ width: "200px", height: "200px", transition: "opacity 0.5s ease-in-out" }} />
                  <p style={{ marginTop: "10px", fontWeight: "bold" }}>{currentShadeName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
