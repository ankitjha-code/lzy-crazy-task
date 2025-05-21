"use client";

import React, { useState } from "react";
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

  // State to track which field is currently focused
  const [focusedField, setFocusedField] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset, // Add reset function from react-hook-form
    formState: { errors, isValid, isDirty },
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
    },
    mode: "onChange", // Changed from onBlur to onChange for more responsive validation
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

  // Helper function to handle focus and blur events
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Helper function to register fields with focus/blur handlers
  const registerField = (name, options = {}) => {
    return {
      ...register(name, options),
      onFocus: () => handleFocus(name),
      onBlur: (e) => {
        handleBlur();
        // Call the original onBlur from react-hook-form
        register(name).onBlur(e);
      },
    };
  };

  // Modify button click handlers to update form values
  const handlePropertyTypeClick = (value) => {
    const newValue = selectedPropertyType === value ? "" : value;
    setSelectedPropertyType(newValue);
    setValue("propertyType", newValue, { shouldValidate: true });
  };

  const handleBHKClick = (value) => {
    const newValue = selectedBHK === value ? "" : value;
    setSelectedBHK(newValue);
    setValue("bhk", newValue, { shouldValidate: true });
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
      // Limit to maximum 20 photos
      const newPhotos = [...photos, ...validFiles].slice(0, 20);
      setPhotos(newPhotos);
      setValue("photos", newPhotos, { shouldValidate: true });
    }
  };

  // Remove photo
  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    setValue("photos", newPhotos, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-4">
      <div className="p-2 sm:p-4 flex items-center">
        <h1 className="text-center flex-1 font-bold text-xl sm:text-2xl">
          POST YOUR AD
        </h1>
      </div>
      <div className="bg-white pb-6 sm:pb-16 border-1 border-gray-300 rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* SELECTED CATEGORY */}
          <div className="border-b border-gray-300">
            <div className="w-full sm:w-4/5 md:w-4/5 p-3 sm:p-4">
              <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-6">
                SELECTED CATEGORY
              </h2>
              <div className="text-xs sm:text-sm mb-3 text-gray-500">
                <span>Properties</span>
                <span className="mx-1">/</span>
                <span>For Sale: Houses & Apartments</span>
                <button
                  type="button"
                  className="ml-2 sm:ml-3 text-[#004896] font-bold underline underline-offset-4 decoration-2 hover:no-underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
          {/* INCLUDE SOME DETAILS */}
          <div className="border-b border-gray-300">
            <div className="w-full sm:w-4/5 md:w-4/5 p-4 sm:p-8">
              <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                INCLUDE SOME DETAILS
              </h2>
              {/* Property Type */}
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <Button
                    type="button"
                    variant={
                      selectedPropertyType === "Flats / Apartments"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm justify-start px-1.5 py-1.5 font-normal"
                    onClick={() =>
                      handlePropertyTypeClick("Flats / Apartments")
                    }
                  >
                    Flats / Apartments
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedPropertyType === "Independent / Builder Floors"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm justify-start px-1.5 py-1.5 font-normal"
                    onClick={() =>
                      handlePropertyTypeClick("Independent / Builder Floors")
                    }
                  >
                    Independent / Builder Floors
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedPropertyType === "Farm House"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm justify-start px-1.5 py-1.5 font-normal"
                    onClick={() => handlePropertyTypeClick("Farm House")}
                  >
                    Farm House
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedPropertyType === "House & Villa"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm justify-start px-1.5 py-1.5 font-normal"
                    onClick={() => handlePropertyTypeClick("House & Villa")}
                  >
                    House & Villa
                  </Button>
                </div>
                {errors.propertyType && (
                  <FormMessage>{errors.propertyType.message}</FormMessage>
                )}
              </FormItem>
              {/* BHK */}
              <FormItem className="">
                <FormLabel>BHK</FormLabel>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["1", "2", "3", "4", "4+"].map((bhk) => (
                    <Button
                      key={bhk}
                      type="button"
                      variant={selectedBHK === bhk ? "default" : "outline"}
                      className="h-8 w-16 p-0 min-w-[64px] text-sm font-normal"
                      onClick={() => handleBHKClick(bhk)}
                    >
                      {bhk}
                    </Button>
                  ))}
                </div>
              </FormItem>
              {/* Bathrooms */}
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["1", "2", "3", "4", "4+"].map((bathroom) => (
                    <Button
                      key={bathroom}
                      type="button"
                      variant={
                        selectedBathrooms === bathroom ? "default" : "outline"
                      }
                      className="h-8 w-16 p-0 min-w-[64px] text-sm font-normal"
                      onClick={() => handleBathroomsClick(bathroom)}
                    >
                      {bathroom}
                    </Button>
                  ))}
                </div>
              </FormItem>
              {/* Furnishing */}
              <FormItem>
                <FormLabel>Furnishing</FormLabel>
                <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 mt-1">
                  <Button
                    type="button"
                    variant={
                      selectedFurnishing === "Furnished" ? "default" : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleFurnishingClick("Furnished")}
                  >
                    Furnished
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedFurnishing === "Semi Furnished"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleFurnishingClick("Semi Furnished")}
                  >
                    Semi Furnished
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedFurnishing === "Unfurnished"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleFurnishingClick("Unfurnished")}
                  >
                    Unfurnished
                  </Button>
                </div>
              </FormItem>
              {/* Project Status */}
              <FormItem>
                <FormLabel>Project Status</FormLabel>
                <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 mt-1">
                  <Button
                    type="button"
                    variant={
                      selectedProjectStatus === "New Launch"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleProjectStatusClick("New Launch")}
                  >
                    New Launch
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedProjectStatus === "Ready to Move"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleProjectStatusClick("Ready to Move")}
                  >
                    Ready to Move
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedProjectStatus === "Under Construction"
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() =>
                      handleProjectStatusClick("Under Construction")
                    }
                  >
                    Under Construction
                  </Button>
                </div>
              </FormItem>
              {/* Listed By */}
              <FormItem>
                <FormLabel>Listed by</FormLabel>
                <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 mt-1">
                  <Button
                    type="button"
                    variant={
                      selectedListedBy === "Builder" ? "default" : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleListedByClick("Builder")}
                  >
                    Builder
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedListedBy === "Dealer" ? "default" : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleListedByClick("Dealer")}
                  >
                    Dealer
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedListedBy === "Owner" ? "default" : "outline"
                    }
                    className="h-8 text-sm px-1 py-1.5 font-normal"
                    onClick={() => handleListedByClick("Owner")}
                  >
                    Owner
                  </Button>
                </div>
              </FormItem>
              {/* Super Built-up area */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "superBuiltUpArea" ? "text-purple-800" : ""
                  }
                >
                  Super Built-up area sqft *
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("superBuiltUpArea")}
                    className={`h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                      errors.superBuiltUpArea
                        ? "border-red-500 focus-visible:border-red-500"
                        : "focus-visible:border-purple-800"
                    }`}
                  />
                </FormControl>
                {errors.superBuiltUpArea && (
                  <FormMessage>{errors.superBuiltUpArea.message}</FormMessage>
                )}
              </FormItem>
              {/* Carpet Area */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "carpetArea" ? "text-purple-800" : ""
                  }
                >
                  Carpet Area sqft *
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("carpetArea")}
                    className={`h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                      errors.carpetArea
                        ? "border-red-500 focus-visible:border-red-500"
                        : "focus-visible:border-purple-800"
                    }`}
                  />
                </FormControl>
                {errors.carpetArea && (
                  <FormMessage>{errors.carpetArea.message}</FormMessage>
                )}
              </FormItem>
              {/* Maintenance */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "maintenance" ? "text-purple-800" : ""
                  }
                >
                  Maintenance (Monthly)
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("maintenance")}
                    className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-purple-800"
                  />
                </FormControl>
              </FormItem>
              {/* Total Floors */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "totalFloors" ? "text-purple-800" : ""
                  }
                >
                  Total Floors
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("totalFloors")}
                    className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-purple-800"
                  />
                </FormControl>
              </FormItem>
              {/* Floor No */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "floorNo" ? "text-purple-800" : ""
                  }
                >
                  Floor No
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("floorNo")}
                    className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-purple-800"
                  />
                </FormControl>
              </FormItem>
              {/* Car Parking */}
              <FormItem>
                <FormLabel>Car Parking</FormLabel>
                <div className="flex gap-2 mt-1">
                  {["0", "1", "2", "3", "3+"].map((parking) => (
                    <Button
                      key={parking}
                      type="button"
                      variant={
                        selectedCarParking === parking ? "default" : "outline"
                      }
                      className="h-8 w-16 p-0 min-w-[64px] text-sm font-normal"
                      onClick={() => handleCarParkingClick(parking)}
                    >
                      {parking}
                    </Button>
                  ))}
                </div>
              </FormItem>
              {/* Facing */}
              <FormItem>
                <FormLabel
                  className={focusedField === "facing" ? "text-purple-800" : ""}
                >
                  Facing
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    setValue("facing", value, { shouldValidate: true });
                  }}
                  onOpenChange={(open) => {
                    if (open) handleFocus("facing");
                    else handleBlur();
                  }}
                >
                  <SelectTrigger
                    className={`h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 
      ${focusedField === "facing" ? "border-purple-800 border-2" : ""}`}
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="north-east">North East</SelectItem>
                    <SelectItem value="north-west">North West</SelectItem>
                    <SelectItem value="south-east">South East</SelectItem>
                    <SelectItem value="south-west">South West</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              {/* Project Name */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "projectName" ? "text-purple-800" : ""
                  }
                >
                  Project Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("projectName")}
                    className={`h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                      !isProjectNameValid
                        ? "border-red-500 focus-visible:border-red-500"
                        : "focus-visible:border-purple-800"
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 70) {
                        setProjectNameCount(value.length);
                        setValue("projectName", value, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    maxLength={70}
                  />
                </FormControl>
                <div
                  className={`text-right text-xs ${
                    projectNameCount > 70 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {projectNameCount} / 70
                </div>
                {errors.projectName && (
                  <FormMessage>{errors.projectName.message}</FormMessage>
                )}
              </FormItem>

              {/* Ad title */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "adTitle" ? "text-purple-800" : ""
                  }
                >
                  Ad title *
                </FormLabel>
                <FormControl>
                  <Input
                    {...registerField("adTitle")}
                    className={`h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                      errors.adTitle || !isAdTitleValid
                        ? "border-red-500 focus-visible:border-red-500"
                        : "focus-visible:border-purple-800"
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 70) {
                        setAdTitleCount(value.length);
                        setValue("adTitle", value, { shouldValidate: true });
                      }
                    }}
                    maxLength={70}
                  />
                </FormControl>
                {errors.adTitle && (
                  <FormMessage>{errors.adTitle.message}</FormMessage>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Mention the key features of your item (e.g. brand, model, age,
                  type)
                </div>
                <div
                  className={`text-right text-xs ${
                    adTitleCount > 70 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {adTitleCount} / 70
                </div>
              </FormItem>

              {/* Description */}
              <FormItem>
                <FormLabel
                  className={
                    focusedField === "description" ? "text-purple-800" : ""
                  }
                >
                  Description *
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...registerField("description")}
                    className={`min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                      errors.description || !isDescriptionValid
                        ? "border-red-500 focus-visible:border-red-500"
                        : "focus-visible:border-purple-800"
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 4096) {
                        setDescriptionCount(value.length);
                        setValue("description", value, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    maxLength={4096}
                  />
                </FormControl>
                {errors.description && (
                  <FormMessage>{errors.description.message}</FormMessage>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Include condition, features and reason for selling
                </div>
                <div
                  className={`text-right text-xs ${
                    descriptionCount > 4096 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {descriptionCount} / 4096
                </div>
              </FormItem>
            </div>
          </div>
          {/* SET A PRICE */}
          <div className="border-b border-gray-300">
            <div className="w-full sm:w-4/5 md:w-4/5 p-3 sm:p-4">
              <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                SET A PRICE
              </h2>
              <FormItem>
                <FormLabel
                  className={focusedField === "price" ? "text-purple-800" : ""}
                >
                  Price *
                </FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                    <div className="block h-6 w-px bg-gray-300 mx-4"></div>
                  </div>

                  <FormControl>
                    <Input
                      {...registerField("price")}
                      className={`h-10 pl-7 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                        errors.price
                          ? "border-red-500 focus-visible:border-red-500"
                          : "focus-visible:border-purple-800"
                      }`}
                    />
                  </FormControl>
                </div>
                {errors.price && (
                  <FormMessage>{errors.price.message}</FormMessage>
                )}
              </FormItem>
            </div>
          </div>
          {/* UPLOAD UP TO 20 PHOTOS */}
          <div className="border-b border-gray-300">
            <div className="w-full sm:w-4/5 md:w-4/5 p-3 sm:p-4">
              <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                UPLOAD UP TO 20 PHOTOS
              </h2>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 gap-2">
                {/* Render uploaded photos */}
                {photos.map((photo, index) => (
                  <div
                    key={`photo-${index}`}
                    className="border border-gray-300 rounded aspect-square relative overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Empty boxes to complete the grid */}
                {Array.from({ length: Math.max(1, 20 - photos.length) }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      onClick={() => handlePhotoClick(photos.length + index)}
                      className={`border ${
                        index === 0 ? "border-black" : "border-gray-300"
                      } rounded aspect-square flex flex-col items-center justify-center ${
                        index === 0 ? "text-black" : "text-gray-400"
                      } cursor-pointer hover:bg-gray-50`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {index === 0 && (
                        <span className="text-xs mt-1">Add Photo</span>
                      )}
                    </div>
                  )
                )}
              </div>

              {photoError ? (
                <div className="text-xs text-red-500 mt-2">{photoError}</div>
              ) : photos.length === 0 ? (
                <div className="text-xs text-red-500 mt-2">
                  This field is mandatory
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-2">
                  {photos.length} of 20 photos added
                </div>
              )}

              {errors.photos && (
                <FormMessage>{errors.photos.message}</FormMessage>
              )}
            </div>
          </div>
          {/* CONFIRM YOUR LOCATION */}
          <div className="border-b border-gray-300">
            <div className="w-full sm:w-4/5 md:w-4/5 p-3 sm:p-4">
              <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                CONFIRM YOUR LOCATION
              </h2>
              <div className="flex border-b border-gray-300 mb-4">
                <button
                  type="button"
                  className="py-1 sm:py-2 px-2 sm:px-4 border-b-2 border-blue-500 font-medium text-xs sm:text-sm"
                >
                  LIST
                </button>
                <button
                  type="button"
                  className="py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  CURRENT LOCATION
                </button>
              </div>
              <FormItem>
                <FormLabel
                  className={focusedField === "state" ? "text-purple-800" : ""}
                >
                  State *
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    setValue("state", value, { shouldValidate: true });
                  }}
                  onOpenChange={(open) => {
                    if (open) handleFocus("state");
                    else handleBlur();
                  }}
                >
                  <SelectTrigger
                    className={`h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                      errors.state
                        ? "border-red-500 focus-visible:border-red-500"
                        : "focus-visible:border-purple-800"
                    }`}
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
                {errors.state && (
                  <FormMessage>{errors.state.message}</FormMessage>
                )}
                {/* Remove duplicate error message */}
              </FormItem>
            </div>
          </div>
          {/* REVIEW YOUR DETAILS */}
          <div className="border-b-2 border-gray-300">
            <div className="w-full sm:w-4/5 md:w-4/5 p-3 sm:p-4">
              <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                REVIEW YOUR DETAILS
              </h2>

              {/* Profile section with improved alignment */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-500 overflow-hidden mb-3 sm:mb-0 sm:mr-3">
                  <img
                    src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <div className="font-medium text-lg sm:text-xl">
                    Ankit Kumar Jha
                  </div>
                  <div className="text-xs text-gray-500">11 / 70</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">
                  Let's verify your account
                </h3>
                <p className="text-xs text-gray-700">
                  We will send you a confirmation code by sms on the next step.
                </p>
              </div>

              <FormItem>
                <FormLabel
                  className={
                    focusedField === "mobileNumber" ? "text-purple-800" : ""
                  }
                >
                  Mobile Phone Number *
                </FormLabel>
                <div className="flex w-full sm:w-4/5">
                  <div className="bg-gray-100 border border-gray-300 rounded-l px-2 sm:px-3 flex items-center text-xs sm:text-sm">
                    +91
                  </div>
                  <FormControl>
                    <Input
                      {...registerField("mobileNumber")}
                      className={`h-10 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 ${
                        errors.mobileNumber
                          ? "border-red-500 focus-visible:border-red-500"
                          : "focus-visible:border-purple-800"
                      }`}
                    />
                  </FormControl>
                </div>
                {errors.mobileNumber && (
                  <FormMessage>{errors.mobileNumber.message}</FormMessage>
                )}
              </FormItem>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full sm:w-4/5 md:w-4/5 p-6 h-10">
            <Button
              type="submit"
              className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-center ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              Post now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Hero;
