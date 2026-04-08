export interface ChallanItem {
  id: string;
  description: string;
  qty: number;
  rate: string;
  amount: string;
}

export interface ChallanFormData {
  // Section 1
  organizationName: string;
  organizationAddress: string;

  // Section 2
  contactName: string;
  contactMobile: string;
  serialNo: string;
  challanDate: string;

  // Section 3
  transportMode: string;
  ewayBillIssued: string;
  vehicleNumber: string;

  // Section 4
  items: ChallanItem[];
  freight: string;
  insurance: string;
  packingCharges: string;
  totalValueInWords: string;

  // Images
  stampImage: string | null;
  signImage: string | null;
}

export const defaultChallanData: ChallanFormData = {
  organizationName: "",
  organizationAddress: "",
  contactName: "",
  contactMobile: "",
  serialNo: "",
  challanDate: new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
  transportMode: "Hand carry",
  ewayBillIssued: "No",
  vehicleNumber: "NA",
  items: [{ id: "1", description: "", qty: 1, rate: "N/A", amount: "N/A" }],
  freight: "",
  insurance: "",
  packingCharges: "",
  totalValueInWords: "",
  stampImage: null,
  signImage: null,
};
