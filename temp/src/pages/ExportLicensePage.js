import { useDispatch, useSelector } from "react-redux";
import { exportLicense } from "./licenseSlice";

const ExportLicensePage = () => {
  const dispatch = useDispatch();
  const { exportData, status, error } = useSelector((state) => state.license);

  const handleExport = () => {
    const companyId = "someCompanyId"; // Replace with dynamic input or selector
    dispatch(exportLicense(companyId));
  };

  return (
    <div>
      <h2>Export/Download License</h2>
      <button onClick={handleExport} disabled={status === "loading"}>
        {status === "loading" ? "Exporting..." : "Export License"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {exportData && (
        <a
          href={URL.createObjectURL(new Blob([JSON.stringify(exportData)]))}
          download="license.json"
        >
          Download
        </a>
      )}
    </div>
  );
};

export default ExportLicensePage;
