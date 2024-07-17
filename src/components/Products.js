import React, { useState } from 'react';
import * as Yup from 'yup';
import logo from "../assets/PotlatchDeltic-Logo.png";
import "./Products.css"

const validationSchema = Yup.object().shape({
    ProductSuggestions: Yup.string().required('Name is required'),
    Commentary: Yup.string().required('Message is required'),
    Email: Yup.string().email('Invalid email address').required('Email is required'),
    Phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Invalid phone number')
        .required('Phone number is required'),
});

const Products = () => {
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const [serverResponse, setServerResponse] = useState(null);
    const [formData, setFormData] = useState({
        LeadName: "",
        Phone: "",
        Commentary: "",
        Email: "",
        ProductSuggestions: "",
        EntityName: "Lead",
    });

    const inputHandle = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validate = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const newErrors = {};
            err.inner.forEach((error) => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validate();
        if (isValid) {
            try {
                const finalFormData = {
                    ...formData,
                    Commentary:`Email: ${formData.Email} - Phone: ${formData.Phone} - Message: ${formData.Commentary}`,
                    LeadName: `Need for our products / ${formData.LeadName}`, // Adding a constant prefix
                  };
                setStep(step + 1);
                // Using fetch
                const response = await fetch('https://webhooks.creatio.com/webhooks/7df1ce6d-59e7-4c12-8ea2-fff49d6e6bfd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(finalFormData),
                });

                const result = await response.json();
                setServerResponse(result);

                console.log('Server response', result);
            } catch (error) {
                console.error('Error submitting form', error);
            }
        }
    };

    return (
        <div className="container-fluid form-container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 text-center p-0 mb-2">
                    <div className="card px-0">
                        <img className="my-4" src={logo} style={{ maxWidth: "220px", margin: "0 auto" }} alt='logo' />
                        {step !== 2 && (
                            <h2 id="heading">Explore our timberlands.</h2>
                        )}
                        <form id="msform" onSubmit={handleSubmit}>
                            <br />
                            {step === 1 && (
                                <div>
                                    <div className="form-card">
                                        <div className="row">
                                            <div className="col-7">
                                                <h2 className="fs-title">I'm interested in your product!</h2>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="first-left col-md-6">
                                                <label className="fieldlabels">Name: *</label>
                                                <input type="text" name="LeadName"
                                                    placeholder="Name"
                                                    value={formData.LeadName}
                                                    onChange={inputHandle}
                                                    required /><p style={{ color: 'red' }}>{errors.LeadName}</p>
                                                    
                                                    <label className="fieldlabels" for="state">Product: *</label>
                                                <select
                                                    type="text"
                                                    name="ProductSuggestions"
                                                    placeholder="Product"
                                                    id="state"
                                                    onChange={inputHandle}
                                                    value={formData.ProductSuggestions}
                                                    required>
                                                    <option value="">--Please select a Product--</option>
                                                    <option value="Southern Lumber">Southern Lumber</option>
                                                </select>{errors.ProductSuggestions && <p style={{ color: 'red' }}>{errors.ProductSuggestions}</p>}

                                                <label className="fieldlabels">Email: *</label>
                                                <input
                                                    type="email"
                                                    name="Email"
                                                    placeholder="Email Id"
                                                    onChange={inputHandle}
                                                    value={formData.Email}
                                                    required
                                                /><p style={{ color: 'red' }}>{errors.Email}</p>

                                                <label className="fieldlabels">Phone Number: *</label>
                                                <input
                                                    type="text"
                                                    name="Phone"
                                                    placeholder="Phone Number"
                                                    onChange={inputHandle}
                                                    value={formData.Phone}
                                                    required
                                                /><p style={{ color: 'red' }}>{errors.Phone}</p>
                                                
                                                <label className="fieldlabels">Message: *</label>
                                                <input
                                                    type="text"
                                                    name="Commentary"
                                                    placeholder="Message"
                                                    onChange={inputHandle}
                                                    value={formData.Commentary}
                                                    required
                                                /><p style={{ color: 'red' }}>{errors.Commentary}</p>
                                            </div>
                                        </div>
                                    </div><button className="action-button" type="submit">Submit</button>
                                    {serverResponse && <div className="server-response">{JSON.stringify(serverResponse)}</div>}
                                </div>
                            )}
                            {step === 2 && (
                                <div className="form-card">
                                    <br /><br />
                                    <h5 id="purple-text text-center">
                                    Thank you for being our valued customer, We hope our product will meet your expectations. Thank you for choosing our product.
                                    </h5>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
