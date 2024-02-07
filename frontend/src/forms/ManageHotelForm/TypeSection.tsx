import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const { register, watch, formState: {errors} } = useFormContext<HotelFormData>();
  const typeWatch = watch("type");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Typ hotelu</h2>
      <div className="grid grid-cols-5 gap-1">
        {hotelTypes.map(
          (
            type //radio button for each hotel type
          ) => (
            // <label
            //   className={
            //     typeWatch === type
            //       ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold"
            //       : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
            //   }
            // >
            <label
              className={`cursor-pointer text-sm rounded-full px-4 py-2 font-semibold ${
                typeWatch === type ? "bg-blue-300" : "bg-gray-300"
              } ${
                type === "Wyżywienie we własnym zakresie"
                  ? "whitespace-nowrap"
                  : ""
              }`}
            >
              <input
                type="radio"
                value={type}
                {...register("type", {
                  required: "To pole jest wymagane.",
                })}
                className="hidden"
              />
              <span>{type}</span>
            </label>
          )
        )}
      </div>

      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
