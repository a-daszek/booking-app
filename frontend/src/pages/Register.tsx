import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    //react-query
    onSuccess: async () => {
      // console.log("Rejestracja zakończona sukcesem.");
      showToast({
        message: "Rejestracja zakończona sukcesem.",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");//we don't need to refresh the page when we register to be taken to the homepage
      navigate("/");
    },
    onError: (error: Error) => {
      // console.log(error.message);
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Stwórz konto</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Imię
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "To pole jest wymagane." })}
          ></input>
          {errors.firstName && ( //if the left is true, then do right
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Nazwisko
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "To pole jest wymagane." })}
          ></input>
          {errors.lastName && ( //if the left is true, then do right
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "To pole jest wymagane." })}
        ></input>
        {errors.email && ( //if the left is true, then do right
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Hasło
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "To pole jest wymagane.",
            minLength: {
              value: 6,
              message: "Hasło musi składać się z przynajmniej 6 znaków.",
            },
          })}
        ></input>
        {errors.password && ( //if the left is true, then do right
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Powtórz hasło
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "To pole jest wymagane.";
              } else if (watch("password") !== val) {
                return "Hasła nie są takie same.";
              }
            },
          })}
        ></input>
        {errors.confirmPassword && ( //if the left is true, then do right
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Stwórz konto
        </button>
      </span>
    </form>
  );
};

export default Register;
