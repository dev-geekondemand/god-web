"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useAppDispatch } from "@/lib/hooks";
import Geek, { RateCard } from "@/interfaces/Geek";
import { Category } from "@/interfaces/Category";
import { updateRateCard } from "@/features/geek/geekSlice";
import toast from "react-hot-toast";
import { UISelect } from "./UISelect";
import CustomInput from "./CustonInput";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Trash2, CreditCard } from "lucide-react";

interface RateCardSectionProps {
  geek: Geek;
}

const RateCardSection: React.FC<RateCardSectionProps> = ({ geek }) => {
  const dispatch = useAppDispatch();
  const [localRateCards, setLocalRateCards] = useState<RateCard[]>(geek.rateCard || []);
  const [submitting, setSubmitting] = useState(false);

  const allSkills: Category[] = [geek.primarySkill, ...(geek.secondarySkills || [])];

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
          orig => (orig.skill?._id === entry.skill?._id) && orig.chargeType === entry.chargeType
        )
      );
      if (newEntries.length === 0) {
        toast.error("No new rate cards to save.");
        setSubmitting(false);
        return;
      }
      await dispatch(updateRateCard({ id: geek._id, data: newEntries })).unwrap();
    } catch (err) {
      console.error("Error submitting rate cards", err);
    }
    setSubmitting(false);
  };

  const geekState = useSelector((state: RootState) => state.geek);

  useEffect(() => {
    if (geekState?.isRateCardUpdated === true && geekState?.isSuccess) {
      toast.dismiss();
      toast.success("Rate card updated successfully");
      window.location.reload();
    }
  }, [geekState?.isRateCardUpdated, geekState?.isSuccess]);

  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Rate Cards</h3>
        <p className="text-sm text-gray-500 mt-0.5">Set your pricing for each skill</p>
      </div>

      {/* Existing entries */}
      {localRateCards.length > 0 && (
        <div className="flex flex-col gap-2">
          {localRateCards.map(entry => (
            <div key={entry._id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 group">
              <div>
                <p className="text-sm font-semibold text-gray-800">{entry.skill?.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">₹{entry.rate} &middot; {entry.chargeType}</p>
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
      )}

      {localRateCards.length === 0 && (
        <div className="flex flex-col items-center py-6 text-gray-400">
          <CreditCard className="w-7 h-7 mb-2 opacity-30" />
          <p className="text-sm">No rate cards yet</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Add new entry */}
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
        disabled={submitting}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        {submitting ? "Saving..." : "Save Rate Cards"}
      </button>
    </div>
  );
};

export default RateCardSection;
