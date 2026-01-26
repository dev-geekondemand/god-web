"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useAppDispatch } from "@/lib/hooks";
import Geek, { RateCard } from "@/interfaces/Geek";
import { Category } from "@/interfaces/Category";
import { updateRateCard } from "@/features/geek/geekSlice";
import toast from "react-hot-toast";
import {UISelect}  from "./UISelect";
import CustomInput from "./CustonInput";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
// import { updateGeekRateCard } from "@/features/geek/geekThunk";

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
      const exists = localRateCards.find((entry:RateCard) => entry.skill?._id === values.skill || entry.skill?._id === values.skill);
      if (exists) {
        toast.error("You have already added a rate card for this skill.");
        return;
      }

      const skillObj = allSkills.find((s) => s._id === values.skill);
      if (!skillObj) return;

      const newEntry = {
        _id: Date.now().toString(),
        skill: skillObj,
        chargeType: values.chargeType,
        rate: Number(values.rate),
      };

      setLocalRateCards((prev) => [...prev, newEntry]);
      resetForm();
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this rate entry?")) {
      setLocalRateCards((prev) => prev.filter((entry) => entry._id !== id));
    }
  };

const handleFinalSubmit = async () => {
  try {
    setSubmitting(true);

    // ✅ Compare local vs original geek.rateCard
    const newEntries = localRateCards.filter(
      (entry) =>
        !geek.rateCard?.some(
          (orig) =>
            (orig.skill?._id || orig.skill?._id) === (entry.skill?._id || entry.skill?._id) &&
            orig.chargeType === entry.chargeType
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
  
useEffect(()=>{
  if(geekState?.isRateCardUpdated === true && geekState?.isSuccess){
    toast.dismiss();
    toast.success('Rate card updated successfully');
    window.location.reload();
  }
},[geekState?.isRateCardUpdated, geekState?.isSuccess])

  return (
    <div className="space-y-3 w-full bg-white max-w-lg mx-auto rounded-xl h-full overflow-y-scroll custom-scrollbar py-8">
      <h2 className="text-2xl font-semibold">Rate Card</h2>

      {/* Existing Entries */}
      {localRateCards.length > 0 ? (
        localRateCards.map((entry) => (
          <div key={entry._id} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="font-medium">
                {entry.skill?.title} 
              </p>
              <div className="flex justify-between items-center pl-3">
              <p className="text-sm text-gray-500 flex items-center gap-2">₹{entry.rate}<span>({entry.chargeType})</span></p>
                <button
                    className="text-teal-600 cursor-pointer hover:underline"
                    onClick={() => handleDelete(entry._id)}
                    >
                    Delete
                </button>
              </div>
            </div>
           
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No rate entries yet.</p>
      )}

      {/* Add New Entry */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="w-full">
          <UISelect
            placeholder="Select a skill"
            label="Skill"
            value={formik.values.skill}
            onChange={(val) => formik.setFieldValue("skill", val)}   // ✅ use setFieldValue
            options={allSkills.map((skill) => ({
              label: skill.title,
              value: skill._id,
              disabled: !!localRateCards.find((e) => e.skill?._id === skill._id), // ✅ pass disabled
            }))}
          />

          
        </div>

        <div className="w-full">
          <UISelect 
          placeholder="Select a charge type" 
          options={[{ label: "Per Ticket", value: "Per Ticket" }, { label: "Per Hour", value: "Hourly" }]}
          label="Charge Type" 
          onChange={(val) => formik.setFieldValue("chargeType", val)} 
          value={formik.values.chargeType} />
        </div>

        <div>
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
            title="Rate"
            labelBg="bg-white"
          />
          
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-sm text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Rate
        </button>
      </form>

      {/* Final Submit */}
      <button
        className="bg-green-600 text-white px-4 cursor-pointer text-sm py-2 rounded hover:bg-green-700"
        disabled={submitting}
        onClick={handleFinalSubmit}
      >
        {submitting ? "Saving..." : "Save All"}
      </button>
    </div>
  );
};

export default RateCardSection;
