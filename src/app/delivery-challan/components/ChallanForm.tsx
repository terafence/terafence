"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { ChallanFormData, ChallanItem } from "../lib/types";

interface ChallanFormProps {
  data: ChallanFormData;
  onChange: (data: ChallanFormData) => void;
}

export default function ChallanForm({ data, onChange }: ChallanFormProps) {
  const stampInputRef = useRef<HTMLInputElement>(null);
  const signInputRef = useRef<HTMLInputElement>(null);

  const update = (partial: Partial<ChallanFormData>) => {
    onChange({ ...data, ...partial });
  };

  const updateItem = (index: number, partial: Partial<ChallanItem>) => {
    const items = [...data.items];
    items[index] = { ...items[index], ...partial };
    update({ items });
  };

  const addItem = () => {
    update({
      items: [
        ...data.items,
        {
          id: String(data.items.length + 1),
          description: "",
          qty: 1,
          rate: "N/A",
          amount: "N/A",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const items = data.items.filter((_, i) => i !== index);
    update({ items: items.map((item, i) => ({ ...item, id: String(i + 1) })) });
  };

  const handleImageUpload = (
    field: "stampImage" | "signImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ [field]: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Organization */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
          Deliver To
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-slate-600">Organization Name</Label>
            <Input
              value={data.organizationName}
              onChange={(e) => update({ organizationName: e.target.value })}
              placeholder="e.g. Dievas Technologies Private Limited"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">
              Organization Address
            </Label>
            <Textarea
              value={data.organizationAddress}
              onChange={(e) => update({ organizationAddress: e.target.value })}
              placeholder="Full address with PIN code"
              rows={2}
              className="mt-1 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Contact & Challan Details */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
          Challan Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600">
              Point of Contact - Name
            </Label>
            <Input
              value={data.contactName}
              onChange={(e) => update({ contactName: e.target.value })}
              placeholder="Mr. Anubhav Bansal"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">Mobile No.</Label>
            <Input
              value={data.contactMobile}
              onChange={(e) => update({ contactMobile: e.target.value })}
              placeholder="9911408697"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">
              Serial No. of Challan
            </Label>
            <Input
              value={data.serialNo}
              onChange={(e) => update({ serialNo: e.target.value })}
              placeholder="084"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">Date of Challan</Label>
            <Input
              type="date"
              value={data.challanDate}
              onChange={(e) => update({ challanDate: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Transport */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
          Transport Details
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-slate-600">Transport Mode</Label>
            <Select
              value={data.transportMode}
              onValueChange={(v) => update({ transportMode: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hand carry">Hand carry</SelectItem>
                <SelectItem value="Road">Road</SelectItem>
                <SelectItem value="Air">Air</SelectItem>
                <SelectItem value="Rail">Rail</SelectItem>
                <SelectItem value="Courier">Courier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-600">Eway Bill Issued</Label>
            <Select
              value={data.ewayBillIssued}
              onValueChange={(v) => update({ ewayBillIssued: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-600">Vehicle Number</Label>
            <Input
              value={data.vehicleNumber}
              onChange={(e) => update({ vehicleNumber: e.target.value })}
              placeholder="NA"
              className="mt-1"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Items */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Description of Goods
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-8 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_2fr_80px_80px_80px_32px] gap-2 text-xs font-medium text-slate-500 px-1">
            <span>S.No</span>
            <span>Description</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
            <span></span>
          </div>

          {data.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr_80px_80px_80px_32px] gap-2 items-center"
            >
              <div className="text-sm text-slate-600 text-center bg-slate-50 rounded px-2 py-2">
                {index + 1}
              </div>
              <Input
                value={item.description}
                onChange={(e) =>
                  updateItem(index, { description: e.target.value })
                }
                placeholder="Item description"
                className="h-9 text-sm"
              />
              <Input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) =>
                  updateItem(index, { qty: parseInt(e.target.value) || 1 })
                }
                className="h-9 text-sm text-center"
              />
              <Input
                value={item.rate}
                onChange={(e) => updateItem(index, { rate: e.target.value })}
                className="h-9 text-sm text-center"
              />
              <Input
                value={item.amount}
                onChange={(e) => updateItem(index, { amount: e.target.value })}
                className="h-9 text-sm text-center"
              />
              <button
                onClick={() => removeItem(index)}
                disabled={data.items.length <= 1}
                className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <Label className="text-xs text-slate-600">Freight</Label>
            <Input
              value={data.freight}
              onChange={(e) => update({ freight: e.target.value })}
              placeholder="Leave blank if none"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">Insurance</Label>
            <Input
              value={data.insurance}
              onChange={(e) => update({ insurance: e.target.value })}
              placeholder="Leave blank if none"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">
              Packing & Forwarding
            </Label>
            <Input
              value={data.packingCharges}
              onChange={(e) => update({ packingCharges: e.target.value })}
              placeholder="Leave blank if none"
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-3">
          <Label className="text-xs text-slate-600">
            Total Value of Goods (in words)
          </Label>
          <Input
            value={data.totalValueInWords}
            onChange={(e) => update({ totalValueInWords: e.target.value })}
            placeholder="e.g. Four units only"
            className="mt-1"
          />
        </div>
      </section>

      {/* Section 5: Stamp & Signature */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
          Stamp & Signature
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Stamp Upload */}
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">
              Company Stamp
            </Label>
            {data.stampImage ? (
              <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50">
                <img
                  src={data.stampImage}
                  alt="Stamp"
                  className="w-full h-24 object-contain"
                />
                <button
                  onClick={() => update({ stampImage: null })}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => stampInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-500">Upload stamp</span>
              </button>
            )}
            <input
              ref={stampInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload("stampImage", e)}
            />
          </div>

          {/* Signature Upload */}
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">
              Authorized Signature
            </Label>
            {data.signImage ? (
              <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50">
                <img
                  src={data.signImage}
                  alt="Signature"
                  className="w-full h-24 object-contain"
                />
                <button
                  onClick={() => update({ signImage: null })}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-500">
                  Upload signature
                </span>
              </button>
            )}
            <input
              ref={signInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload("signImage", e)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
