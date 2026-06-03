'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useAppDispatch } from '@/lib/hooks';
import Geek from '@/interfaces/Geek';
import { loadGeek, updateAddress } from '@/features/geek/geekSlice';
import CustomInput from './CustonInput';
import toast from 'react-hot-toast';
import { LocateFixed } from 'lucide-react';

const AddressForm = ( {openAddressForm, setOpenAddressForm} :{openAddressForm: boolean, setOpenAddressForm: any}) => {
  const dispatch = useAppDispatch();
  const geek = useSelector((state: RootState) => state.geek.geek) as Geek;
  const [loadingLocation, setLoadingLocation] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pin: geek?.address?.pin || '',
      city: geek?.address?.city || '',
      state: geek?.address?.state || '',
      country: geek?.address?.country || '',
      line1: geek?.address?.line1 || '',
      line2: geek?.address?.line2 || '',
      coordinates: geek?.address?.location?.coordinates || undefined,
    },
    validationSchema: Yup.object({
      line1: Yup.string().required('Line 1 is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      pin: Yup.string().required('PIN is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateAddress({ id: geek?._id, address: values })).then(() => {
        formik.resetForm();
        dispatch(loadGeek());
        setOpenAddressForm(false);
      });
    },
  });

  const applyLocationToFormik = (loc: { city: string; state: string; country: string; pin: string; coordinates: [number, number] }) => {
    formik.setFieldValue('coordinates', loc.coordinates);
    formik.setFieldValue('city', loc.city);
    formik.setFieldValue('state', loc.state);
    formik.setFieldValue('country', loc.country);
    formik.setFieldValue('pin', loc.pin || '');
    formik.setFieldValue('line1', '');
  };

  const fetchAndApplyMapboxAddress = async ([lon, lat]: [number, number]) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const place = data.features;
      const getContextValue = (contextType: string) => {
        const contextItem = place[0]?.context?.find((c: { id: string; text: string }) => c.id.includes(contextType));
        return contextItem?.text || '';
      };
      formik.setFieldValue('coordinates', [lon, lat]);
      formik.setFieldValue('city', getContextValue('place'));
      formik.setFieldValue('state', getContextValue('region'));
      formik.setFieldValue('country', getContextValue('country'));
      formik.setFieldValue('pin', getContextValue('postcode'));
      formik.setFieldValue('line1', '');
      toast.success('Location fetched successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Mapbox fetch failed');
    }
  };

  const fetchIPLocation = async () => {
    try {
      const res = await fetch(`https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`);
      const data = await res.json();
      const [latitude, longitude] = data.loc.split(',');
      return {
        city: data.city || '',
        state: data.region || '',
        country: data.country || '',
        pin: data.postal || '',
        coordinates: [parseFloat(longitude), parseFloat(latitude)] as [number, number],
      };
    } catch (err) {
      console.error('Failed to fetch IP location', err);
      return null;
    }
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        if (accuracy > 10000) {
          const ipLocation = await fetchIPLocation();
          if (ipLocation) applyLocationToFormik(ipLocation);
          else toast.error('Could not determine location');
        } else {
          await fetchAndApplyMapboxAddress([longitude, latitude]);
        }
        setLoadingLocation(false);
      },
      async () => {
        const ipLocation = await fetchIPLocation();
        if (ipLocation) applyLocationToFormik(ipLocation);
        else toast.error('Could not determine location');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!geek?._id) dispatch(loadGeek());
  }, [geek?._id, dispatch]);

  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Edit Address</h3>
        <p className="text-sm text-gray-500 mt-0.5">Update your service location</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div>
          <CustomInput type="text" name="line1" onChange={formik.handleChange} value={formik.values.line1}
            placeholder="" labelFor="line1" title="Address Line 1" required={true} labelBg="bg-white" disabled={false} readOnly={false} />
          {formik.touched.line1 && formik.errors.line1 && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.line1}</p>
          )}
        </div>

        <CustomInput type="text" name="line2" placeholder=" " onChange={formik.handleChange}
          value={formik.values.line2} labelFor="line2" title="Address Line 2 (optional)"
          required={false} labelBg="bg-white" disabled={false} readOnly={false} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomInput type="text" name="city" placeholder="" onChange={formik.handleChange}
              value={formik.values.city} labelFor="city" title="City" required={true}
              labelBg="bg-white" disabled={false} readOnly={false} />
            {formik.touched.city && formik.errors.city && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.city}</p>
            )}
          </div>
          <div>
            <CustomInput type="text" name="state" placeholder="" onChange={formik.handleChange}
              value={formik.values.state} labelFor="state" title="State" required={true}
              labelBg="bg-white" disabled={false} readOnly={false} />
            {formik.touched.state && formik.errors.state && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomInput type="text" name="country" placeholder="" onChange={formik.handleChange}
              value={formik.values.country} labelFor="country" title="Country" required={true}
              labelBg="bg-white" disabled={false} readOnly={false} />
            {formik.touched.country && formik.errors.country && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.country}</p>
            )}
          </div>
          <div>
            <CustomInput type="text" name="pin" placeholder="" onChange={formik.handleChange}
              value={formik.values.pin} labelFor="pin" title="PIN Code" required={true}
              labelBg="bg-white" disabled={false} readOnly={false} />
            {formik.touched.pin && formik.errors.pin && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.pin}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={getCurrentLocation} disabled={loadingLocation}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
            {loadingLocation ? 'Detecting...' : 'Use My Location'}
          </button>

          <button type="submit"
            disabled={!formik.isValid || loadingLocation || !geek?._id}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
