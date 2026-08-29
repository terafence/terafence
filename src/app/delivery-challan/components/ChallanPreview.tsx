"use client";

import { forwardRef } from "react";
import { ChallanFormData } from "../lib/types";

interface ChallanPreviewProps {
  data: ChallanFormData;
}

const b = "1px solid #000";
const bk = "'Bookman Old Style', Georgia, serif";
const cal = "Calibri, 'Segoe UI', Arial, sans-serif";

const ChallanPreview = forwardRef<HTMLDivElement, ChallanPreviewProps>(
  ({ data }, ref) => {
    const totalQty = data.items.reduce((s, i) => s + (i.qty || 0), 0);
    const totalAmt = data.items.reduce((s, i) => {
      const a = parseFloat(i.amount);
      return s + (isNaN(a) ? 0 : a);
    }, 0);

    const fmtDate = (d: string) => {
      if (!d) return "DD/MM/YYYY";
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return d;
        return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
      } catch { return d; }
    };

    const rows = Math.max(5, data.items.length);
    const items = [...data.items];
    while (items.length < rows)
      items.push({ id: "", description: "", qty: 0, rate: "", amount: "" });

    const placeholder = (text: string) => (
      <span style={{ color: "#bbb", fontWeight: "normal" }}>{text}</span>
    );

    return (
      <div
        ref={ref}
        id="challan-preview"
        className="bg-white shadow-md mx-auto"
        style={{ width: "210mm", minHeight: "297mm", fontFamily: cal, fontSize: "11pt", color: "#000" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", border: "2px solid #000", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "5.5%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "19.5%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <tbody>
            {/* ──── HEADER: Logo + Company + Copy Type ──── */}
            <tr>
              <td colSpan={2} rowSpan={4} style={{ border: b, padding: "6px", verticalAlign: "middle", textAlign: "center" }}>
                <img src="/images/terafence.png" alt="Logo" style={{ maxWidth: "88px", maxHeight: "62px", objectFit: "contain" }} />
              </td>
              <td colSpan={4} rowSpan={2} style={{ border: b, fontFamily: bk, fontSize: "20pt", fontWeight: "bold", textAlign: "center", verticalAlign: "middle", padding: "4px" }}>
                Terafence Pvt Ltd
              </td>
              <td colSpan={2} style={{ border: b, fontWeight: "bold", padding: "3px 10px", verticalAlign: "top" }}>Original</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: b, fontWeight: "bold", padding: "3px 10px" }}>Duplicate</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ border: b, textAlign: "center", padding: "2px" }}>www.terafence.in</td>
              <td colSpan={2} style={{ border: b, fontWeight: "bold", padding: "3px 10px" }}>Triplicate</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ border: b, textAlign: "center", fontFamily: bk, fontSize: "14pt", fontWeight: "bold", padding: "2px" }}>
                GST NO: 06AAICT2873P1ZN
              </td>
              <td colSpan={2} style={{ border: b, fontWeight: "bold", padding: "3px 10px" }}>Extra OC</td>
            </tr>

            {/* Spacer */}
            <tr><td colSpan={8} style={{ border: b, height: "6px", padding: 0 }} /></tr>

            {/* ──── TITLE ──── */}
            <tr>
              <td colSpan={8} style={{ border: b, textAlign: "center", fontFamily: bk, fontSize: "20pt", fontWeight: "bold", padding: "8px 4px" }}>
                Delivery Challan - FOR POC (Demo) ONLY
              </td>
            </tr>
            <tr>
              <td colSpan={8} style={{ border: b, textAlign: "center", fontFamily: bk, fontSize: "14pt", fontWeight: "bold", padding: "4px" }}>
                GOODS ARE NOT FOR SALE
              </td>
            </tr>

            {/* ──── DELIVER TO / FROM ──── */}
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>DELIVER TO - FOR POC ONLY</td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>FROM</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px", verticalAlign: "top" }}>
                {data.organizationName || placeholder("Organization Name")}
              </td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>Terafence Limited</td>
            </tr>
            <tr>
              <td colSpan={4} rowSpan={2} style={{ border: b, fontWeight: "bold", padding: "4px 8px", verticalAlign: "top", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                {data.organizationAddress || placeholder("Organization Address")}
              </td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px", fontSize: "10pt", lineHeight: "1.3" }}>
                Unit No 209, Suncity Success Tower, Golf Course Extn Road, Sector 65, Gurugram - 122005, Haryana
              </td>
            </tr>
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>GST No: 06AAICT2873P1ZN</td>
            </tr>

            {/* Contact */}
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>
                Contact -&nbsp;&nbsp;
                {data.contactName && data.contactMobile
                  ? `${data.contactName}, ${data.contactMobile}`
                  : data.contactName || data.contactMobile || placeholder("Full Name, Mobile No.")}
              </td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>&nbsp;</td>
            </tr>

            {/* Serial / Transport */}
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>
                Serial no. of Challan: {data.serialNo || placeholder("XXX")}
              </td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>
                Transport Mode: {data.transportMode}
              </td>
            </tr>

            {/* Date / Eway */}
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>
                Date of Challan: {fmtDate(data.challanDate)}
              </td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>
                Eway Bill issued -&nbsp;&nbsp;&nbsp;&nbsp;{data.ewayBillIssued}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vehicle Number: {data.vehicleNumber}
              </td>
            </tr>

            {/* Marine Cargo */}
            <tr>
              <td colSpan={8} style={{ border: b, fontWeight: "bold", textAlign: "center", padding: "4px 8px" }}>
                Marine Cargo Insurance (Specific Voyage Policy) Policy No.
              </td>
            </tr>

            {/* Spacer */}
            <tr><td colSpan={8} style={{ border: b, height: "6px", padding: 0 }} /></tr>

            {/* ──── TABLE HEADER ──── */}
            <tr style={{ fontWeight: "bold", fontSize: "10pt", textAlign: "center" }}>
              <td style={{ border: b, padding: "8px 2px" }}>S. No.</td>
              <td colSpan={2} style={{ border: b, padding: "8px 4px" }}>Description of Goods</td>
              <td style={{ border: b, padding: "8px 2px" }}>HSN code</td>
              <td style={{ border: b, padding: "8px 2px" }}>UOM</td>
              <td style={{ border: b, padding: "8px 2px" }}>Qty</td>
              <td style={{ border: b, padding: "8px 2px" }}>Rate</td>
              <td style={{ border: b, padding: "8px 2px" }}>Amount</td>
            </tr>

            {/* ──── ITEM ROWS ──── */}
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{ border: b, padding: "6px 4px", textAlign: "center", height: "30px" }}>
                  {item.description ? i + 1 : ""}
                </td>
                <td colSpan={2} style={{ border: b, padding: "6px 8px" }}>{item.description}</td>
                <td style={{ border: b, padding: "6px 4px", textAlign: "center" }}>&nbsp;</td>
                <td style={{ border: b, padding: "6px 4px", textAlign: "center" }}>&nbsp;</td>
                <td style={{ border: b, padding: "6px 4px", textAlign: "center" }}>{item.qty || ""}</td>
                <td style={{ border: b, padding: "6px 4px", textAlign: "center" }}>{item.rate}</td>
                <td style={{ border: b, padding: "6px 4px", textAlign: "center" }}>{item.amount}</td>
              </tr>
            ))}

            {/* ──── FREIGHT / INSURANCE / PACKING ──── */}
            {[
              { label: "Freight", value: data.freight },
              { label: "Insurance", value: data.insurance },
              { label: "Packing and Forwarding Charges", value: data.packingCharges },
            ].map((row) => (
              <tr key={row.label}>
                <td colSpan={5} style={{ border: b, fontWeight: "bold", padding: "3px 8px" }}>{row.label}</td>
                <td style={{ border: b, padding: "3px 4px", textAlign: "center" }}>&nbsp;</td>
                <td style={{ border: b, padding: "3px 4px", textAlign: "center" }}>&nbsp;</td>
                <td style={{ border: b, padding: "3px 4px", textAlign: "center" }}>{row.value}</td>
              </tr>
            ))}

            {/* ──── TOTAL ──── */}
            <tr>
              <td colSpan={5} style={{ border: b, textAlign: "center", fontFamily: bk, fontSize: "18pt", fontWeight: "bold", padding: "8px" }}>
                Total
              </td>
              <td style={{ border: b, padding: "8px 4px", textAlign: "center", fontWeight: "bold", fontSize: "12pt" }}>{totalQty}</td>
              <td style={{ border: b, padding: "8px 4px", textAlign: "center" }}>&nbsp;</td>
              <td style={{ border: b, padding: "8px 4px", textAlign: "center", fontWeight: "bold", fontSize: "12pt" }}>{totalAmt || ""}</td>
            </tr>

            {/* ──── TOTAL IN WORDS ──── */}
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px" }}>Total value of Goods (in words)</td>
              <td colSpan={4} style={{ border: b, padding: "4px 8px", textAlign: "center", fontFamily: bk, fontSize: "12pt" }}>
                {data.totalValueInWords}
              </td>
            </tr>

            {/* ──── T&C LEFT + SIGNATURE RIGHT ──── */}
            <tr>
              <td colSpan={4} rowSpan={4} style={{ border: b, padding: "8px", verticalAlign: "top", fontSize: "10.5pt" }}>
                <div style={{ fontWeight: "bold", fontSize: "12pt", marginBottom: "8px" }}>Terms &amp; conditions:-</div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>1. Goods supplied are for demo purpose only</div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>2. Goods supplied are for on returnable basis</div>
                <div style={{ fontWeight: "bold", lineHeight: "1.4" }}>
                  3. If the goods are not returned within 2 months from the challan date, the goods will be considered as sold and an invoice will be issued, payable within 7 days of invoice date
                </div>
              </td>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px", textAlign: "center" }}>
                For Terafence Limited
              </td>
            </tr>

            {/* Stamp + Sign area */}
            <tr>
              <td colSpan={4} rowSpan={2} style={{ border: b, padding: "8px", textAlign: "center", verticalAlign: "middle", height: "130px" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", minHeight: "110px" }}>
                  {data.stampImage && (
                    <img src={data.stampImage} alt="Stamp" style={{ maxHeight: "105px", maxWidth: "105px", objectFit: "contain" }} />
                  )}
                  {data.signImage && (
                    <img src={data.signImage} alt="Sign" style={{ maxHeight: "85px", maxWidth: "105px", objectFit: "contain" }} />
                  )}
                  {!data.stampImage && !data.signImage && (
                    <span style={{ color: "#ddd", fontSize: "10pt" }}>Stamp &amp; Signature Area</span>
                  )}
                </div>
              </td>
            </tr>
            <tr />

            {/* Authorised signatory */}
            <tr>
              <td colSpan={4} style={{ border: b, fontWeight: "bold", padding: "4px 8px", textAlign: "center" }}>
                Authorised signatory
              </td>
            </tr>

            {/* ──── FOOTER ──── */}
            <tr>
              <td colSpan={8} style={{ border: b, fontWeight: "bold", textAlign: "center", padding: "4px 8px", fontSize: "10pt" }}>
                209, Suncity Success Tower, Golf Course Extn Road, Sector 65, Gurugram - 122005, Haryana
              </td>
            </tr>
            <tr>
              <td colSpan={8} style={{ border: b, fontWeight: "bold", textAlign: "center", padding: "4px 8px", fontSize: "10pt" }}>
                CIN NO : U72900HR2020PTC091527
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);

ChallanPreview.displayName = "ChallanPreview";
export default ChallanPreview;
