'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { fetchGeekDetails, updateGeekAddress } from '@/redux/geek/geekThunk';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useAppDispatch } from '@/lib/hooks';
import Geek from '@/interfaces/Geek';
import { loadGeek, updateAddress } from '@/features/geek/geekSlice';
import CustomInput from './CustonInput';
import toast from 'react-hot-toast';

const AddressForm = () => {
  const dispatch = useAppDispatch();
  const  geek  = useSelector((state:RootState) => state.geek.geek) as Geek;
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
    //   line3: geek?.address?.line3 || '',
      coordinates: geek?.address?.location?.coordinates || undefined,
    },
    validationSchema: Yup.object({
      line1: Yup.string().required('Line 1 is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      pin: Yup.string().required('Pin is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateAddress({ id: geek?._id, address: values }));
        setTimeout(()=>{
            formik.resetForm();
            window.location.reload();
        },2000)
        },
  });


  const applyLocationToFormik = (loc: { city: string; state: string; country: string; pin: string; coordinates: [number, number]; }) => {
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
      const contextItem = place[0]?.context?.find((c: { id: string; text: string }) =>
        c.id.includes(contextType)
      );
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
    const res = await fetch(`https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`); // Replace <YOUR_TOKEN>
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
    
      // Check if accuracy is poor
      if (accuracy > 10000) {
        // Fallback to IP-based location
        const ipLocation = await fetchIPLocation();
        
        if (ipLocation) {
          applyLocationToFormik(ipLocation);
        } else {
          toast.error('Could not determine location');
        }
      } else {
        // Use accurate geolocation + Mapbox
        await fetchAndApplyMapboxAddress([longitude, latitude]);
      }

      setLoadingLocation(false);
    },
    async () => {
      // On error, fallback to IP-based
      const ipLocation = await fetchIPLocation();
      if (ipLocation) {
        applyLocationToFormik(ipLocation);
      } else {
        toast.error('Could not determine location');
      }
      setLoadingLocation(false);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};




  useEffect(() => {
    if (!geek?._id) {
      dispatch(loadGeek());
    }
  }, [geek?._id, dispatch]);

  return (
    <section className='w-full  flex flex-col p-6 items-center justify-center gap-7'>
        <div className='w-full flex items-center justify-center'>
            <h3 className='h2'>Edit Address</h3>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-2xl">
            <div className='flex flex-col gap-2 '>
                
                <CustomInput
                type="text"
                name="line1"
                onChange={formik.handleChange}
                value={formik.values.line1}
                placeholder=""
                labelFor="line1"
                title="Line 1"
                required={true}
                labelBg="bg-white"
                disabled={false}
                readOnly={false}
                />
                {formik?.touched?.line1 && formik?.errors?.line1 && <p className="text-red-500">{formik?.errors?.line1}</p>}
            </div>

            <CustomInput
                type="text"
                name="line2"
                placeholder=" "
                onChange={formik.handleChange}
                value={formik.values.line2}
                labelFor="line2"
                title="Line 2"
                required={false}
                labelBg="bg-white"
                disabled={false}
                readOnly={false}
            />


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-2">
               <div className='flex flex-col gap-2 '>
                <CustomInput
                type="text"
                name="city"
                placeholder=""
                onChange={formik.handleChange}
                value={formik.values.city}
                labelFor="city"
                title="City"
                required={true}
                labelBg="bg-white"
                disabled={false}
                readOnly={false}
                />
                  {formik?.touched?.city && formik?.errors?.city && <p className="text-red-500">{formik?.errors?.city}</p>}  
                </div> 
                <div className='flex flex-col gap-2 '>
                <CustomInput
                type="text"
                name="state"
                placeholder=""
                onChange={formik.handleChange}
                value={formik.values.state}
                labelFor="state"
                title="State"
                required={true}
                labelBg="bg-white"
                disabled={false}
                readOnly={false}
                />
                {formik?.touched?.state && formik?.errors?.state && <p className="text-red-500">{formik?.errors?.state}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-2">
                <div className='flex flex-col gap-2 '>
                <CustomInput
                type="text"
                name="country"
                placeholder=""
                onChange={formik.handleChange}
                value={formik.values.country}
                labelFor="country"
                title="Country"
                required={true}
                labelBg="bg-white"
                disabled={false}
                readOnly={false}
                />
                {formik?.touched?.country && formik?.errors?.country && <p className="text-red-500">{formik.errors.country}</p>}
                </div>
                <div className='flex flex-col gap-2 '>
                <CustomInput
                type="text"
                name="pin"
                placeholder=""
                onChange={formik.handleChange}
                value={formik.values.pin}
                labelFor="pin"
                title="PIN Code"
                required={true}
                labelBg="bg-white"
                disabled={false}
                readOnly={false}
                />
                {formik?.touched?.pin && formik?.errors?.pin && <p className="text-red-500">{formik?.errors?.pin}</p>}
                </div>
            </div>

            <div className='flex gap-6 sm:flex-row flex-col cursor-pointer items-center justify-center '>
                <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {loadingLocation ? 'Getting location...' : 'Use Current Location'}
            </button>

            <button
                disabled={!formik.isValid || loadingLocation || !geek?._id}
                type="submit"
                className={`bg-green-600 text-white px-4 py-2 rounded ${!formik.isValid || loadingLocation || !geek?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Save Address
            </button>
            </div>
        </form>
    </section>
  );
};

export default AddressForm;
