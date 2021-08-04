const isEmail = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

export default function formValidation(name, value, schema) {
    const { validate } = schema[name];
    let error = "";

    switch (validate) {
        case "email":
            if (!isEmail.test(value)) error = "Ingrese un correo válido";
            break;
        case "text":
            if (value.length === 0) error = "Contrasena requerida";
            break;

        default:
            break;
    }

    return error;
}
