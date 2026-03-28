import * as yup from "yup";

export const newPlayerFormSchema = yup.object({
    uid: yup.string().required(),
});

export type NewPlayerFormType = yup.InferType<typeof newPlayerFormSchema>;
