"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import { useAppDispatch } from "@/lib/hooks";
import Geek, { RateCard } from "@/interfaces/Geek";
import { Category } from "@/interfaces/Category";
import { loadGeek, updateRateCard } from "@/features/geek/geekSlice";
import toast from "react-hot-toast";
import { UISelect } from "./UISelect";
import CustomInput from "./CustonInput";
import { Trash2, CreditCard } from "lucide-react";

interface RateCardSectionProps {
  geek: Geek;
  onClose?: () => void;
}

const RateCardSection: React.FC<RateCardSectionProps> = ({ geek, onClose }) => {
  const dispatch = useAppDispatch();
  const [localRateCards, setLocalRateCards] = useState<RateCard[]>(geek.rateCard || []);
  const [submitting, setSubmitting] = useState(false);

  const allSkills: Category[] = [geek.primarySkill, ...(geek.secondarySkills || [])];

  const hasChanges = useMemo(() => {
    const original = geek.rateCard || [];
    if (localRateCards.length !== original.length) return true;
    return localRateCards.some(
      entry => !original.some(
        orig => orig.skill?._id === entry.skill?._id && orig.chargeType === entry.chargeType && orig.rate === entry.rate
      )
    );
  }, [localRateCards, geek.rateCard]);

  const isNewEntry = (entry: RateCard) =>
    !(geek.rateCard || []).some(orig => orig.skill?._id === entry.skill?._id);

  const formik = useFormik({
    initialValues: {
      skill: "",
      chargeType: "Per Ticket",
      rate: "",
    },
    onSubmit: (values, { resetForm }) => {
      const exists = localRateCards.find(entry => entry.skill?._id === values.skill);
      if (exists) {
        toast.error("Rate card for this skill already exists.");
        return;
      }
      const skillObj = allSkills.find(s => s._id === values.skill);
      if (!skillObj) return;
      setLocalRateCards(prev => [...prev, {
        _id: Date.now().toString(),
        skill: skillObj,
        chargeType: values.chargeType,
        rate: Number(values.rate),
      }]);
      resetForm();
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this rate entry?")) {
      setLocalRateCards(prev => prev.filter(entry => entry._id !== id));
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const newEntries = localRateCards.filter(
        entry => !geek.rateCard?.some(
          orig => orig.skill?._id === entry.skill?._id && orig.chargeType === entry.chargeType
        )
      );
      await dispatch(updateRateCard({ id: geek._id, data: newEntries })).unwrap();
      toast.success("Rate card updated successfully");
      dispatch(loadGeek());
      onClose?.();
    } catch (err) {
      console.error("Error submitting rate cards", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Rate Cards</h3>
        <p className="text-sm text-gray-500 mt-0.5">Set your pricing for each skill</p>
      </div>

      {localRateCards.length > 0 ? (
        <div className="flex flex-col gap-2">
          {localRateCards.map(entry => (
            <div
              key={entry._id}
              className={`flex items-center justify-between rounded-lg px-4 py-3 group transition-colors ${
                isNewEntry(entry)
                  ? "border border-teal-300 bg-teal-50/50"
                  : "border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{entry.skill?.title}</p>
                    {isNewEntry(entry) && (
                      <span className="text-[10px] font-semibold text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded-full leading-none">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">₹{entry.rate} &middot; {entry.chargeType}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-lg">
          <CreditCard className="w-7 h-7 mb-2 opacity-30" />
          <p className="text-sm">No rate cards yet</p>
          <p className="text-xs text-gray-400 mt-0.5">Add one below to get started</p>
        </div>
      )}

      <div className="border-t border-gray-100" />

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm font-medium text-gray-700">Add a rate card</p>

        <UISelect
          placeholder="Select a skill"
          label="Skill"
          value={formik.values.skill}
          onChange={val => formik.setFieldValue("skill", val)}
          options={allSkills.map(skill => ({
            label: skill.title,
            value: skill._id,
            disabled: !!localRateCards.find(e => e.skill?._id === skill._id),
          }))}
        />

        <UISelect
          placeholder="Select charge type"
          options={[
            { label: "Per Ticket", value: "Per Ticket" },
            { label: "Per Hour", value: "Hourly" },
          ]}
          label="Charge Type"
          onChange={val => formik.setFieldValue("chargeType", val)}
          value={formik.values.chargeType}
        />

        <CustomInput
          type="number"
          name="rate"
          value={formik.values.rate}
          onChange={formik.handleChange}
          placeholder=""
          required
          disabled={false}
          readOnly={false}
          labelFor="rate"
          title="Rate (₹)"
          labelBg="bg-white"
        />

        <button
          type="submit"
          disabled={!formik.values.skill || !formik.values.rate}
          className="border border-teal-600 text-teal-600 hover:bg-teal-50 text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          + Add Entry
        </button>
      </form>

      <button
        onClick={handleFinalSubmit}
        disabled={!hasChanges || submitting}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        title={!hasChanges ? "No unsaved changes" : undefined}
      >
        {submitting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default RateCardSection;
