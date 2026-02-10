import React, { useState } from "react";
import ResultCard from "./ResultCard";
import { getToken, getUserRole } from "../../utils/auth";

const ModelView = ({
  title,
  description,
  icon,
  color = "primary",
  apiEndpoint,
  titleCard,
  requiresPatientId = false,
  patientId = null,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    if (apiEndpoint && selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        if (requiresPatientId && patientId) {
          formData.append("patient_id", patientId);
        }

        const token = getToken();
        const userRole = getUserRole().toLowerCase();

        // Build URL with user_role query parameter
        // If the endpoint already has query params, append with &
        const separator = apiEndpoint.includes('?') ? '&' : '?';
        const urlWithRole = `${apiEndpoint}${separator}user_role=${userRole}`;

        const response = await fetch(urlWithRole, {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Map API response to internal format
        // Handle different response structures
        setResult({
          diagnosis: data.analysis || data.class_label_ar || data.class_label_en,
          diagnosisEn: data.class_label_en,
          confidence: data.confidence_level,
          advice: data.generated_advice,
          raw: data,
        });
      } catch (err) {
        console.error("Analysis failed:", err);
        setError("حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Fallback to mock data if no endpoint provided
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult({
          diagnosis:
            "بناءً على تحليل الصورة المقدمة، هناك مؤشرات تشير إلى شذوذ محتمل يتوافق مع الأنماط المبكرة. ومع ذلك، يتطلب التشخيص النهائي الارتباط السريري.",
          nextSteps: JSON.stringify([
            "استشر أخصائيًا للحصول على مراجعة تفصيلية",
            "حدد موعدًا لفحص متابعة بالرنين المغناطيسي/الأشعة المقطعية إذا أوصى الطبيب",
            "راقب أي أعراض مصاحبة",
          ]),
        });
      }, 2000);
    }
  };

  return (
    <div className="h-100 d-flex flex-column" dir="rtl">
      <div className="text-center mb-4">
        <div
          className={`d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-${color} bg-opacity-10 text-${color} mb-3`}
        >
          <i className={`bi ${icon} display-6`}></i>
        </div>
        <h2 className="fw-bold text-white">{title}</h2>
        <p className="text-white lead fs-6">{description}</p>
      </div>

      <div className="row justify-content-center flex-grow-1">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-none bg-transparent">
            <div className="card-body p-0">
              <div className="mb-4 position-relative">
                <input
                  type="file"
                  accept="image/*"
                  className="position-absolute w-100 h-100 opacity-0"
                  style={{ zIndex: 10, cursor: "pointer" }}
                  onChange={handleImageChange}
                  id="imageUpload"
                />
                <div
                  className={`upload-area p-5 text-center ${isAnalyzing ? "pulse-animation" : ""}`}
                >
                  {selectedImage ? (
                    <div className="position-relative">
                      <img
                        src={selectedImage}
                        alt="معاينة"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "300px", objectFit: "contain" }}
                      />
                      {isAnalyzing && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <div
                            className="spinner-border text-primary"
                            style={{ width: "3rem", height: "3rem" }}
                            role="status"
                          >
                            <span className="visually-hidden">
                              جاري التحميل...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-white py-4">
                      <i
                        className={`bi bi-cloud-arrow-up display-4 text-${color} mb-3 d-block`}
                      ></i>
                      <h5 className="fw-semibold">
                        اسحب الصورة هنا أو انقر للتصفح
                      </h5>
                      <p className="small mb-0">يدعم JPG، PNG، DICOM</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                className={`btn btn-${color} text-white w-100 py-3 rounded-pill fw-bold shadow-sm transition-all`}
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                style={{ transform: isAnalyzing ? "scale(0.98)" : "scale(1)" }}
              >
                {isAnalyzing ? "جاري تحليل الصورة..." : "بدء التحليل"}
              </button>
            </div>
            {error && (
              <div className="alert alert-danger mt-3 fade-in-up" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
          </div>

          {result && (
            <div className="fade-in-up mt-4">
              <ResultCard
                diagnosis={result.diagnosis || result.Diagnose}
                diagnosisEn={result.diagnosisEn}
                nextSteps={result.nextSteps || result.NextSteps}
                advice={result.advice}
                confidence={result.confidence}
                color={color}
                title={titleCard}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelView;
