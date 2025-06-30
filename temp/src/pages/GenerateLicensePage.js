import { useDispatch, useSelector } from "react-redux";
import { generateLicense, clearError, setFormData } from "./licenseSlice";

const GenerateLicensePage = () => {
  const dispatch = useDispatch();
  const { formData, status, error } = useSelector((state) => state.license);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateLicense(formData));
  };

  return (
    <div>
      <h2>Generate License</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.companySubscription}
          onChange={(e) =>
            dispatch(setFormData({ companySubscription: e.target.value }))
          }
          placeholder="Company-Product Subscription"
          required
        />
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) =>
            dispatch(setFormData({ expiryDate: e.target.value }))
          }
          required
        />
        <input
          type="number"
          value={formData.numDevices}
          onChange={(e) =>
            dispatch(setFormData({ numDevices: e.target.value }))
          }
          placeholder="Number of Devices"
          required
        />
        <input
          type="number"
          value={formData.numUsers}
          onChange={(e) => dispatch(setFormData({ numUsers: e.target.value }))}
          placeholder="Number of Users"
          required
        />
        <select
          value={formData.licenseType}
          onChange={(e) =>
            dispatch(setFormData({ licenseType: e.target.value }))
          }
          required
        >
          <option value="">Select License Type</option>
          <option value="type1">Type 1</option>
          <option value="type2">Type 2</option>
        </select>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GenerateLicensePage;
