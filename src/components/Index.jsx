import React from 'react'

const Index = () => {
  return (
    <div>
        <div className="container">
            <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div className="row g-3">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <h1 style={{ marginBottom: "20px" }}><b><center>TOOTH TONE ANALYZER </center></b></h1>
                            <h2 style={{ marginBottom: "20px" }}><b><center>UPLOAD THE IMAGE </center></b></h2>
                        </div>
                       
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <input type="file" name="file" id="file" className="form-control" />
            
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <button className="btn btn primary"><b><center></center>Predict the shade</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Index