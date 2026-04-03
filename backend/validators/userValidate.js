import yup from 'yup';

export const userSchema = yup.object({
    username: yup
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),

    email: yup
    .string()
    .trim()
    .email('Invalid email format')
    .required('Email is required'),

    password: yup
    .string()
    .trim()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),

})

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        next();
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
}