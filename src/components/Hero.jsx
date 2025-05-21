"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "../App.css";

// Form schema
const formSchema = z.object({
  propertyType: z.string().min(1, {
    message: "Property type is mandatory. Please select one option.",
  }),
  bhk: z.string().optional(),
  bathrooms: z.string().optional(),
  furnishing: z.string().optional(),
  projectStatus: z.string().optional(),
  listedBy: z.string().optional(),
  superBuiltUpArea: z
    .string()
    .min(1, {
      message:
        "Super Builtup area sqft is mandatory. Please complete the required field.",
    })
    .regex(/^\d+$/, { message: "Please enter a valid numerical value." }),
  carpetArea: z
    .string()
    .min(1, {
      message: "Carpet Area is mandatory. Please complete the required field.",
    })
    .regex(/^\d+$/, { message: "Please enter a valid numerical value." }),
  maintenance: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Maintenance charge must be a numerical value.",
    }),
  totalFloors: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Total floors must be a numerical value.",
    }),
  floorNo: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Floor number must be a numerical value.",
    }),
  carParking: z.string().optional(),
  facing: z.string().optional(),
  projectName: z
    .string()
    .max(70, { message: "Project name cannot exceed 70 characters." })
    .optional(),
  adTitle: z
    .string()
    .min(10, {
      message:
        "A minimum length of 10 characters is required. Please edit the field.",
    })
    .max(70, { message: "Ad title cannot exceed 70 characters." }),
  description: z
    .string()
    .min(10, {
      message:
        "A minimum length of 10 characters is required. Please edit the field.",
    })
    .max(4096, { message: "Description cannot exceed 4096 characters." }),
  price: z
    .string()
    .min(1, {
      message: "Price is mandatory. Please complete the required field.",
    })
    .regex(/^\d+$/, { message: "Price must be a numerical value." }),
  state: z.string().min(1, {
    message: "State is mandatory. Please complete the required field.",
  }),
  mobileNumber: z
    .string()
    .min(10, {
      message:
        "Valid mobile number is required. Please complete the required field.",
    })
    .max(10, { message: "Mobile number should be 10 digits." })
    .regex(/^[0-9]+$/, {
      message: "Mobile number should contain only digits.",
    }),
  photos: z.array(z.instanceof(File)).min(1, {
    message: "At least one photo is required. Please upload a photo.",
  }),
  name: z
    .string()
    .max(30, { message: "Name cannot exceed 30 characters." })
    .optional(),
});

// Form components
const FormLabel = ({ children, className }) => {
  return (
    <label className={`text-sm font-normal ${className}`}>{children}</label>
  );
};

const FormItem = ({ children }) => {
  return <div className="mb-10">{children}</div>;
};

const FormControl = ({ children }) => {
  return <div>{children}</div>;
};

const FormMessage = ({ children }) => {
  return <div className="text-red-500 text-xs mt-1">{children}</div>;
};

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const Button = ({ children, className, variant, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer";
  const variantClasses =
    variant === "default"
      ? "bg-blue-200 border"
      : variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-blue-100"
      : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Select components
const Select = ({ children, onValueChange, defaultValue, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (onOpenChange) onOpenChange(!isOpen);
  };

  const handleSelect = (val) => {
    setValue(val);
    setIsOpen(false);
    if (onValueChange) onValueChange(val);
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: handleOpen,
            value: value,
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, {
            onSelect: handleSelect,
          });
        }
        return null;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, className, value }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-white ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (child.type === SelectValue) {
          return React.cloneElement(child, { value });
        }
        return child;
      })}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

const SelectValue = ({ value, placeholder, children }) => {
  return <span>{value || children || placeholder}</span>;
};

const SelectContent = ({ children, onSelect }) => {
  return (
    <div className="absolute z-10 mt-1 b-0 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200">
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect: () => onSelect(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ children, value, onSelect }) => {
  return (
    <div
      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};

function Hero() {
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedBHK, setSelectedBHK] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [selectedFurnishing, setSelectedFurnishing] = useState(null);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);
  const [selectedListedBy, setSelectedListedBy] = useState(null);
  const [selectedCarParking, setSelectedCarParking] = useState(null);

  const [projectNameCount, setProjectNameCount] = useState(0);
  const [adTitleCount, setAdTitleCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [nameCount, setNameCount] = useState(14); // Initial count for "Ankit Kumar Jha"

  // State to track which field is currently focused
  const [focusedField, setFocusedField] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = React.useRef(null);

  // Add a state to track fields that have been touched/visited
  const [touchedFields, setTouchedFields] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors, // Add clearErrors method
    formState: { errors, isValid, isDirty },
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "",
      bhk: "",
      bathrooms: "",
      furnishing: "",
      projectStatus: "",
      listedBy: "",
      superBuiltUpArea: "",
      carpetArea: "",
      maintenance: "",
      totalFloors: "",
      floorNo: "",
      carParking: "",
      facing: "",
      projectName: "",
      adTitle: "",
      description: "",
      price: "",
      state: "",
      mobileNumber: "",
      photos: [],
      name: "Ankit Kumar Jha", // Set default value
    },
    mode: "onChange",
  });

  // Watch for all form values to validate the form
  const formValues = watch();

  // Check if all required fields are filled
  const isFormValid = React.useMemo(() => {
    const requiredFields = [
      "propertyType",
      "superBuiltUpArea",
      "carpetArea",
      "adTitle",
      "description",
      "price",
      "state",
      "mobileNumber",
      "photos",
    ];
    return requiredFields.every((field) => {
      // Special handling for photos array
      if (field === "photos") {
        return photos.length > 0 && !errors[field];
      }
      return !!formValues[field] && !errors[field];
    });
  }, [formValues, errors, photos]);

  // Check for character limits
  const isAdTitleValid = adTitleCount <= 70;
  const isDescriptionValid = descriptionCount <= 4096;
  const isProjectNameValid = projectNameCount <= 70;

  function onSubmit(values) {
    console.log(values);

    // Show success message
    alert("Your ad has been posted successfully!");

    // Reset all form fields
    reset({
      propertyType: "",
      bhk: "",
      bathrooms: "",
      furnishing: "",
      projectStatus: "",
      listedBy: "",
      superBuiltUpArea: "",
      carpetArea: "",
      maintenance: "",
      totalFloors: "",
      floorNo: "",
      carParking: "",
      facing: "",
      projectName: "",
      adTitle: "",
      description: "",
      price: "",
      state: "",
      mobileNumber: "",
      photos: [],
      name: "Ankit Kumar Jha", // Reset to default value
    });

    // Reset all state variables
    setSelectedPropertyType(null);
    setSelectedBHK(null);
    setSelectedBathrooms(null);
    setSelectedFurnishing(null);
    setSelectedProjectStatus(null);
    setSelectedListedBy(null);
    setSelectedCarParking(null);

    // Reset character counters
    setProjectNameCount(0);
    setAdTitleCount(0);
    setDescriptionCount(0);
    setNameCount(14); // Reset name count

    // Reset photos
    setPhotos([]);
    setPhotoError("");

    // Reset focused field
    setFocusedField(null);

    // Scroll to top of the form for better UX
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Enhanced helper function to handle focus and blur events
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = async (fieldName) => {
    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate the field
    await trigger(fieldName);

    setFocusedField(null);
  };

  // Enhanced helper function to handle input changes for validation
  const handleInputChange = async (fieldName, value, setCountFunc = null) => {
    // Update character count if needed
    if (setCountFunc) {
      setCountFunc(value.length);
    }

    // Set the field value
    setValue(fieldName, value, { shouldValidate: true });

    // If the field now has a value and previously had an error, trigger validation
    if (value && errors[fieldName]) {
      await trigger(fieldName);

      // If validation now passes, clear the error
      if (!errors[fieldName]) {
        clearErrors(fieldName);
      }
    }
  };

  // Enhanced registration with onChange handler for immediate validation
  const registerField = (name, options = {}) => {
    return {
      ...register(name, options),
      onFocus: () => handleFocus(name),
      onBlur: () => handleBlur(name),
      onChange: (e) => handleInputChange(name, e.target.value),
    };
  };

  // Enhanced registration for fields with character counting
  const registerCountField = (name, setCountFunc, options = {}) => {
    return {
      ...register(name, options),
      onFocus: () => handleFocus(name),
      onBlur: () => handleBlur(name),
      onChange: (e) => handleInputChange(name, e.target.value, setCountFunc),
    };
  };

  // Modify button click handlers to clear errors when valid
  const handlePropertyTypeClick = (value) => {
    const newValue = selectedPropertyType === value ? "" : value;
    setSelectedPropertyType(newValue);
    setValue("propertyType", newValue, { shouldValidate: true });

    // If selecting a valid property type, clear the error
    if (newValue && errors.propertyType) {
      clearErrors("propertyType");
    }
  };

  const handleBHKClick = (value) => {
    const newValue = selectedBHK === value ? "" : value;
    setSelectedBHK(newValue);
    setValue("bhk", newValue, { shouldValidate: true });
    if (newValue && errors.bhk) {
      clearErrors("bhk");
    }
  };

  const handleBathroomsClick = (value) => {
    const newValue = selectedBathrooms === value ? "" : value;
    setSelectedBathrooms(newValue);
    setValue("bathrooms", newValue, { shouldValidate: true });
  };

  const handleFurnishingClick = (value) => {
    const newValue = selectedFurnishing === value ? "" : value;
    setSelectedFurnishing(newValue);
    setValue("furnishing", newValue, { shouldValidate: true });
  };

  const handleProjectStatusClick = (value) => {
    const newValue = selectedProjectStatus === value ? "" : value;
    setSelectedProjectStatus(newValue);
    setValue("projectStatus", newValue, { shouldValidate: true });
  };

  const handleListedByClick = (value) => {
    const newValue = selectedListedBy === value ? "" : value;
    setSelectedListedBy(newValue);
    setValue("listedBy", newValue, { shouldValidate: true });
  };

  const handleCarParkingClick = (value) => {
    const newValue = selectedCarParking === value ? "" : value;
    setSelectedCarParking(newValue);
    setValue("carParking", newValue, { shouldValidate: true });
  };

  // Handle photo click
  const handlePhotoClick = (index) => {
    if (index === 0 || index === photos.length) {
      // If clicking the first box or the next empty box after photos
      fileInputRef.current.click();
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate file types
    const validFiles = selectedFiles.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setPhotoError("Only JPEG, PNG, and WEBP images are allowed");
        return false;
      }
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("Image size should not exceed 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setPhotoError("");
      const newPhotos = [...photos, ...validFiles].slice(0, 20);
      setPhotos(newPhotos);
      setValue("photos", newPhotos, { shouldValidate: true });

      // If we now have photos and there was an error, clear it
      if (newPhotos.length > 0 && errors.photos) {
        clearErrors("photos");
      }
    }
  };

  // Remove photo
  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    setValue("photos", newPhotos, { shouldValidate: true });
  };

  // Add a function to handle numerical input
  const handleNumericInput = (e, fieldName) => {
    // Replace any non-digit characters with empty string
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    // Update the form value
    setValue(fieldName, numericValue, { shouldValidate: true });

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // If field has error and now has valid input, clear error
    if (numericValue && errors[fieldName]) {
      clearErrors(fieldName);
    }

    return numericValue;
  };

  return (
    <div>
      <div className="pt-16"></div>
      <section className="p-6">
        <h1 className="text-xl font-semibold text-center">POST YOUR AD</h1>
      </section>
      <main className="flex-1 border border-gray-300 rounded-sm max-w-3xl mt-[-10px] mx-auto w-[95%] sm:w-full bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="divide-y divide-gray-200">
            <section className="p-6">
              <h2 className="text-base font-semibold mb-2 mt-[-10px]">
                SELECTED CATEGORY
              </h2>
              <div className="flex items-center text-[12px] mt-5 text-gray-400">
                <span>Properties / For Sale: Houses &amp; Apartments</span>
                <button
                  type="button"
                  className="text-[#004896] underline underline-offset-4 decoration-2 ml-3 font-bold hover:text-blue-700 cursor-pointer"
                >
                  Change
                </button>
              </div>
            </section>
            <section className="p-6">
              <h2 className="text-base font-semibold mb-4">
                INCLUDE SOME DETAILS
              </h2>
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.propertyType && touchedFields.propertyType
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 max-w-full md:max-w-md">
                  <button
                    type="button"
                    onClick={() => {
                      handlePropertyTypeClick("Flats / Apartments");
                      setTouchedFields((prev) => ({
                        ...prev,
                        propertyType: true,
                      }));
                    }}
                    className={`px-4 py-2 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                      selectedPropertyType === "Flats / Apartments"
                        ? "bg-blue-100 border-black"
                        : errors.propertyType && touchedFields.propertyType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    Flats / Apartments
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handlePropertyTypeClick("Independent / Builder Floors");
                      setTouchedFields((prev) => ({
                        ...prev,
                        propertyType: true,
                      }));
                    }}
                    className={`px-4 py-2 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                      selectedPropertyType === "Independent / Builder Floors"
                        ? "bg-blue-100 border-black"
                        : errors.propertyType && touchedFields.propertyType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    Independent / Builder Floors
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handlePropertyTypeClick("Farm House");
                      setTouchedFields((prev) => ({
                        ...prev,
                        propertyType: true,
                      }));
                    }}
                    className={`px-4 py-2 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                      selectedPropertyType === "Farm House"
                        ? "bg-blue-100 border-black"
                        : errors.propertyType && touchedFields.propertyType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    Farm House
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handlePropertyTypeClick("House & Villa");
                      setTouchedFields((prev) => ({
                        ...prev,
                        propertyType: true,
                      }));
                    }}
                    className={`px-4 py-2 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                      selectedPropertyType === "House & Villa"
                        ? "bg-blue-100 border-black"
                        : errors.propertyType && touchedFields.propertyType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    House &amp; Villa
                  </button>
                </div>
                {errors.propertyType && touchedFields.propertyType && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">BHK</label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "4+"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        handleBHKClick(value);
                        setTouchedFields((prev) => ({ ...prev, bhk: true }));
                      }}
                      className={`py-2 px-4 border rounded-md text-sm min-w-12 text-center hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                        selectedBHK === value
                          ? "bg-blue-100 border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Bathrooms
                </label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "4+"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        handleBathroomsClick(value);
                        setTouchedFields((prev) => ({
                          ...prev,
                          bathrooms: true,
                        }));
                      }}
                      className={`py-2 px-4 border rounded-md text-sm min-w-12 text-center hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                        selectedBathrooms === value
                          ? "bg-blue-100 border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Furnishing
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Furnished", "Semi-Furnished", "Unfurnished"].map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          handleFurnishingClick(value);
                          setTouchedFields((prev) => ({
                            ...prev,
                            furnishing: true,
                          }));
                        }}
                        className={`py-2 px-4 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                          selectedFurnishing === value
                            ? "bg-blue-100 border-black"
                            : "border-gray-300"
                        }`}
                      >
                        {value}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Project Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["New Launch", "Ready to Move", "Under Construction"].map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          handleProjectStatusClick(value);
                          setTouchedFields((prev) => ({
                            ...prev,
                            projectStatus: true,
                          }));
                        }}
                        className={`py-2 px-4 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                          selectedProjectStatus === value
                            ? "bg-blue-100 border-black"
                            : "border-gray-300"
                        }`}
                      >
                        {value}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Listed by
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Builder", "Dealer", "Owner"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        handleListedByClick(value);
                        setTouchedFields((prev) => ({
                          ...prev,
                          listedBy: true,
                        }));
                      }}
                      className={`py-2 px-4 border rounded-md text-sm hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                        selectedListedBy === value
                          ? "bg-blue-100 border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.superBuiltUpArea ? "text-red-500" : ""
                  }`}
                >
                  Super Builtup area sqft
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.superBuiltUpArea
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  inputMode="numeric"
                  {...register("superBuiltUpArea")}
                  onChange={(e) => {
                    // Only clear error if there's actual input
                    if (e.target.value.trim().length > 0) {
                      handleNumericInput(e, "superBuiltUpArea");
                    } else {
                      setValue("superBuiltUpArea", "", {
                        shouldValidate: false,
                      });
                    }
                  }}
                  // Remove onFocus handler to keep error state
                  onBlur={() => {
                    setTouchedFields((prev) => ({
                      ...prev,
                      superBuiltUpArea: true,
                    }));
                    trigger("superBuiltUpArea");
                  }}
                  placeholder="Enter area in square feet"
                />
                {errors.superBuiltUpArea && (
                  <p className="text-xs text-red-500 mt-1">
                    Super Builtup area sqft is mandatory. Please complete the
                    required field.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.carpetArea ? "text-red-500" : ""
                  }`}
                >
                  Carpet Area sqft <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.carpetArea ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  inputMode="numeric"
                  {...register("carpetArea")}
                  onChange={(e) => {
                    // Only clear error if there's actual input
                    if (e.target.value.trim().length > 0) {
                      handleNumericInput(e, "carpetArea");
                    } else {
                      setValue("carpetArea", "", { shouldValidate: false });
                    }
                  }}
                  // Remove onFocus handler to keep error state
                  onBlur={() => {
                    setTouchedFields((prev) => ({
                      ...prev,
                      carpetArea: true,
                    }));
                    trigger("carpetArea");
                  }}
                  placeholder="Enter carpet area in square feet"
                />
                {errors.carpetArea && (
                  <p className="text-xs text-red-500 mt-1">
                    Carpet Area sqft is mandatory. Please complete the required
                    field.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.maintenance && touchedFields.maintenance
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Maintenance (Monthly)
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.maintenance && touchedFields.maintenance
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  inputMode="numeric"
                  {...register("maintenance")}
                  onChange={(e) => handleNumericInput(e, "maintenance")}
                  placeholder="Enter monthly maintenance amount"
                />
                {errors.maintenance && touchedFields.maintenance && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.maintenance.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.totalFloors && touchedFields.totalFloors
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Total Floors
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.totalFloors && touchedFields.totalFloors
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  inputMode="numeric"
                  {...register("totalFloors")}
                  onChange={(e) => handleNumericInput(e, "totalFloors")}
                  placeholder="Enter total number of floors"
                />
                {errors.totalFloors && touchedFields.totalFloors && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.totalFloors.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.floorNo && touchedFields.floorNo
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Floor No
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.floorNo && touchedFields.floorNo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  inputMode="numeric"
                  {...register("floorNo")}
                  onChange={(e) => handleNumericInput(e, "floorNo")}
                  placeholder="Enter floor number"
                />
                {errors.floorNo && touchedFields.floorNo && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.floorNo.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Car Parking
                </label>
                <div className="flex flex-wrap gap-2">
                  {["0", "1", "2", "3", "3+"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleCarParkingClick(value)}
                      className={`py-2 px-6 border rounded-md text-sm min-w-12 text-center hover:bg-blue-50 hover:border-black transition-colors cursor-pointer ${
                        selectedCarParking === value
                          ? "bg-blue-100 border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.facing && touchedFields.facing ? "text-red-500" : ""
                  }`}
                >
                  Facing
                </label>
                <div className="relative">
                  <select
                    className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 custom-select ${
                      errors.facing && touchedFields.facing
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerField("facing")}
                  >
                    <option value="">Select</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>
                {errors.facing && touchedFields.facing && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.facing.message}
                  </p>
                )}
              </div>

              <div className="mb-6 w-full md:w-[440px]">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.projectName && touchedFields.projectName
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Project Name
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.projectName && touchedFields.projectName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  maxLength="70"
                  type="text"
                  {...registerField("projectName")}
                  onChange={(e) => setProjectNameCount(e.target.value.length)}
                />
                <div className="flex justify-end text-xs text-gray-500 mt-2">
                  <span>{projectNameCount} / 70</span>
                </div>
                {errors.projectName && touchedFields.projectName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.projectName.message}
                  </p>
                )}
              </div>

              <div className="mb-6 w-full md:w-[440px]">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.adTitle && touchedFields.adTitle
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Ad title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                    errors.adTitle && touchedFields.adTitle
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  maxLength="70"
                  type="text"
                  {...registerCountField("adTitle", setAdTitleCount)}
                  placeholder="Mention key features (e.g. brand, model, age, type)"
                />
                <div className="flex flex-col sm:flex-row justify-between text-xs mt-2">
                  {errors.adTitle && touchedFields.adTitle ? (
                    <span className="text-red-500">
                      {errors.adTitle.message}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Mention the key features of your item (e.g. brand, model,
                      age, type)
                    </span>
                  )}
                  <span
                    className={`${
                      adTitleCount < 10 && touchedFields.adTitle
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {adTitleCount} / 70
                  </span>
                </div>
              </div>

              <div className="mb-6 w-full md:w-[440px]">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.description && touchedFields.description
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`py-2 border w-full md:w-[440px] h-[48px] px-4 border-[1px] rounded-sm focus:outline-none min-h-32 ${
                    errors.description && touchedFields.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...registerCountField("description", setDescriptionCount)}
                  maxLength="4096"
                  placeholder="Include condition, features and reason for selling"
                ></textarea>
                <div className="flex justify-between text-xs mt-2">
                  {errors.description && touchedFields.description ? (
                    <span className="text-red-500">
                      {errors.description.message}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Include condition, features and reason for selling
                    </span>
                  )}
                  <span
                    className={`${
                      descriptionCount < 10 && touchedFields.description
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {descriptionCount} / 4096
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.price && touchedFields.price ? "text-red-500" : ""
                  }`}
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <input
                    className={`border w-full md:w-[440px] h-[48px] px-4 pl-6 rounded-sm ${
                      errors.price && touchedFields.price
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    type="text"
                    inputMode="numeric"
                    {...register("price")}
                    onChange={(e) => {
                      // Only clear error if there's actual input
                      if (e.target.value.trim().length > 0) {
                        handleNumericInput(e, "price");
                      } else {
                        setValue("price", "", { shouldValidate: false });
                      }
                    }}
                    // Remove onFocus handler to keep error state
                    onBlur={() => {
                      setTouchedFields((prev) => ({
                        ...prev,
                        price: true,
                      }));
                      trigger("price");
                    }}
                    placeholder="Enter price"
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">
                    Price is mandatory. Please complete the required field.
                  </p>
                )}
              </div>
            </section>

            <section className="p-6">
              <h2 className="text-base font-semibold mb-4">
                UPLOAD UP TO 20 PHOTOS
              </h2>
              <input
                ref={fileInputRef}
                multiple
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleFileChange}
              />
              <div className="w-full md:w-[440px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div
                    onClick={() => {
                      handlePhotoClick(0);
                      setTouchedFields((prev) => ({ ...prev, photos: true }));
                    }}
                    className={`border-2 aspect-square flex items-center justify-center cursor-pointer ${
                      errors.photos &&
                      touchedFields.photos &&
                      photos.length === 0
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        alt="Add Photo"
                        className="w-9 h-9"
                        src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='36px'%20height='36px'%20viewBox='0%200%201024%201024'%20data-aut-id='icon'%20class=''%20fill-rule='evenodd'%3e%3cpath%20class='rui-jB92v'%20d='M861.099%20667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515%20124.16l38.784%20116.437h165.973l38.827%2038.827v271.659l-38.827%2038.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784%20116.48h-183.083v426.923h426.667l38.784%2038.357-38.784%2039.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216%20318.208c106.837%200%20193.92%2086.955%20193.92%20194.048%200%20106.923-87.040%20194.091-193.92%20194.091s-193.963-87.168-193.963-194.091c0-107.093%2087.083-194.048%20193.963-194.048zM473.216%20395.861c-64.213%200-116.352%2052.181-116.352%20116.395%200%2064.256%2052.139%20116.437%20116.352%20116.437%2064.171%200%20116.352-52.181%20116.352-116.437%200-64.213-52.181-116.437-116.352-116.437z'/%3e%3c/svg%3e"
                      />
                      <span className="text-xs mt-1">Add Photo</span>
                    </div>
                  </div>

                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-400 relative aspect-square"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {photos.length < 20 &&
                    Array(Math.min(19, 20 - photos.length))
                      .fill()
                      .map((_, idx) => (
                        <div
                          key={`placeholder-${idx}`}
                          onClick={() => handlePhotoClick(photos.length + idx)}
                          className="border-2 border-gray-400 flex items-center justify-center cursor-pointer aspect-square"
                        >
                          <img
                            className="text-gray-100 w-9 h-9"
                            alt="img-logo"
                            src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40px'%20height='40px'%20viewBox='0%200%201024%201024'%20data-aut-id='icon'%20class=''%20fill-rule='evenodd'%3e%3cpath%20class='rui-jB92v'%20fill='%238D9094'%20d='M861.099%20667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515%20124.16l38.784%20116.437h165.973l38.827%2038.827v271.659l-38.827%2038.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784%20116.48h-183.083v426.923h426.667l38.784%2038.357-38.784%2039.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216%20318.208c106.837%200%20193.92%2086.955%20193.92%20194.048%200%20106.923-87.040%20194.091-193.92%20194.091s-193.963-87.168-193.963-194.091c0-107.093%2087.083-194.048%20193.963-194.048zM473.216%20395.861c-64.213%200-116.352%2052.181-116.352%20116.395%200%2064.256%2052.139%20116.437%20116.352%20116.437%2064.171%200%20116.352-52.181%20116.352-116.437%200-64.213-52.181-116.437-116.352-116.437z'/%3e%3c/svg%3e"
                          />
                        </div>
                      ))}
                </div>
              </div>
              {photoError && (
                <p className="text-xs text-red-500 mt-2">{photoError}</p>
              )}
              {errors.photos && touchedFields.photos && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.photos.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                First photo will be the cover image. Only JPG, PNG or WEBP. Max
                5MB each.
              </p>
            </section>

            <section className="p-6">
              <h2 className="text-base font-semibold mb-4">
                CONFIRM YOUR LOCATION
              </h2>
              <div className="relative border-gray-300 mb-4">
                <div className="flex flex-wrap">
                  <button type="button" className="py-2 px-4 cursor-pointer">
                    <div className="w-full sm:w-40 text-center text-sm font-semibold pb-1 border-b-2 border-[#004896] text-black hover:bg-blue-50 transition-colors">
                      LIST
                    </div>
                  </button>
                  <button type="button" className="py-2 px-4 cursor-pointer">
                    <div className="w-full sm:w-40 text-center text-sm font-semibold pb-1 text-gray-500 hover:bg-blue-50 hover:text-gray-700 transition-colors">
                      CURRENT LOCATION
                    </div>
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.state && touchedFields.state ? "text-red-500" : ""
                  }`}
                >
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className={`border w-full md:w-[440px] h-[40px] border-[1px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 custom-select ${
                      errors.state && touchedFields.state
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerField("state")}
                  >
                    <option value="">Select State</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
                {errors.state && touchedFields.state && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </section>

            <section className="p-6">
              <h2 className="text-base font-semibold mb-4">
                REVIEW YOUR DETAILS
              </h2>

              {/* Fixed Name input section with proper alignment */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl mr-4 flex-shrink-0">
                    <img
                      src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      className={`border border-gray-300 w-full max-w-[360px] h-[40px] rounded-sm focus:border-[#004896] focus:outline-none focus:border-3 px-4 ${
                        errors.name && touchedFields.name
                          ? "border-red-500"
                          : ""
                      }`}
                      maxLength="30"
                      type="text"
                      defaultValue="Ankit Kumar Jha"
                      {...registerCountField("name", setNameCount)}
                    />
                    <div className="flex justify-between max-w-[360px] text-xs mt-2">
                      {errors.name && touchedFields.name ? (
                        <span className="text-red-500">
                          {errors.name.message}
                        </span>
                      ) : (
                        <span className="text-gray-500">Your full name</span>
                      )}
                      <span
                        className={`text-gray-500 ${
                          nameCount > 30 ? "text-red-500" : ""
                        }`}
                      >
                        {nameCount} / 30
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-medium mb-2">
                  Let's verify your account
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We will send you a confirmation code by sms on the next step.
                </p>

                <label
                  className={`block text-sm font-medium mb-2 ${
                    errors.mobileNumber && touchedFields.mobileNumber
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Mobile Phone Number
                  <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex border rounded-md overflow-hidden focus-within:border-[#004896] focus-within:border-3 w-full md:w-[440px] h-[48px] ${
                    errors.mobileNumber && touchedFields.mobileNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex-none w-14 bg-gray-100 border-r border-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium">+91</span>
                  </div>
                  <input
                    className="flex-1 px-4 outline-none h-full"
                    type="text"
                    inputMode="numeric"
                    {...register("mobileNumber")}
                    onChange={(e) => handleNumericInput(e, "mobileNumber")}
                    placeholder={
                      errors.mobileNumber && touchedFields.mobileNumber
                        ? errors.mobileNumber.message
                        : "Enter 10-digit mobile number"
                    }
                  />
                </div>
                {errors.mobileNumber && touchedFields.mobileNumber && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </section>

            <section className="p-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`py-2 px-6 rounded-md ${
                  isFormValid
                    ? "bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Post now
              </button>
              {!isFormValid && (
                <p className="text-xs text-red-500 mt-2">
                  Please fill in all required fields marked with * and fix any
                  errors before submitting.
                </p>
              )}
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Hero;
