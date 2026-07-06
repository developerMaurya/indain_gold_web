export class DynamicValidator {
    static validationRules = {
        Name: {
            required: false,
            minLength: 2,
            maxLength: 50,
            // pattern: /^[a-zA-Z\s]{3,50}$/,
            message: {
                required: 'Name is required',
                minLength: 'Name must be at least 3 characters',
                maxLength: 'Name cannot exceed 50 characters'
                // pattern: 'Name can only contain letters and spaces'
            }
        },
        MobileNo: {
            required: false,
            pattern: /^[0-9]{10}$/,
            message: {
                required: 'Mobile number is required',
                pattern: 'Mobile number must be 10 digits'
            }
        },
        Mobile: {
        required: false,
        pattern: /^[0-9]{10}$/,
        message: {
            required: 'Mobile number is required',
            pattern: 'Mobile number must be 10 digits'
        }
    },
        Password: {
            required: false,
            minLength: 6,
            maxLength: 50,
            message: {
                required: 'Password is required',
                minLength: 'Password must be at least 6 characters',
                maxLength: 'Password cannot exceed 50 characters'
            }
        },
        Email: {
            required: false, // Make it optional
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: {
                pattern: 'Please provide a valid email'
            }
        },
        Sponsor: {
            required: false,
            minLength: 3,
             maxLength: 50,
            message: {
                required: 'Password is required',
                maxLength: 'City cannot exceed 3 characters'
            }
        },
        City: {
            required: false,
            maxLength: 150,
            message: {
                maxLength: 'City cannot exceed 150 characters'
            }
        },
        State: {
            required: false,
            maxLength: 150,
            message: {
                maxLength: 'State cannot exceed 150 characters'
            }
        },
        Country: {
            required: false,
            maxLength: 150,
            message: {
                maxLength: 'Country cannot exceed 150 characters'
            }
        },
        Latitude: {
            required: false,
            pattern: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/,
            message: {
                pattern: 'Invalid latitude format'
            }
        },
        Longitude: {
            required: false,
            pattern: /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.[0-9]{1,10})?|180)$/,
            message: {
                pattern: 'Invalid longitude format'
            }
        },
        OldOtp: {
        required: false,
        message: {
            required: 'Old OTP is required'
        }
        },
        SMSOTP: {
    required: false,
    pattern: /^[0-9]{4}$/,
    message: {
        required: 'SMS OTP is required',
        pattern: 'OTP must be 4 digits'
    }
},
PlanId: {
        required: false,
        message: {
            required: 'Plan ID is required'
        }
    },
    Category: {
        required: false,
        message: {
            required: 'Category is required'
        }
    },
    SubId: {
        required: false,
        message: {
            required: 'Sub ID is required'
        }
    },
    circle: {
        required: false,
        message: {
            required: 'circle is required'
        }
    },
    JsonString: {
        required: false,
        message: {
            required: 'JsonString is required'
        }
    },
    ConsumerNo:{
        required: false,
        message: {
            required: 'ConsumerNo is required'
        }
    },
    Operator:{
        required: false,
        message: {
            required: 'Operator is required'
        }
    },
    Title:{
        required: false,
        message: {
            required: 'Title is required'
        }
    },
    WalletType:{
        required: false,
        message: {
            required: 'WalletType is required'
        }
    },
    OperatorName:{
        required: false,
        message: {
            required: 'OperatorName is required'
        }
    },
    RechargeMobileNo:{
        required: false,
        message: {
            required: 'RechargeMobileNo is required'
        }
    },
    PaymentType:{
        required: false,
        message: {
            required: 'PaymentType is required'
        }
    },
    Amount:{
        required: false,
        message: {
            required: 'Amount is required'
        }
    },
    CatId:{
        required: false,
        message: {
            required: 'CatId is required'
        }
    },
    AccountType: {
            required: false,
            message: {
                required: 'Account type is required'
            }
        },
        CustomerId: {
            required: false,
            message: {
                required: 'Customer ID is required'
            }
        },
        AccountName: {
            required: false,
            message: {
                required: 'Account name is required'
            }
        },
        BankName: {
            required: false,
            message: {
                required: 'Bank name is required'
            }
        },
        IfscCode: {
            required: false,
            pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
            message: {
                required: 'IFSC code is required',
                pattern: 'Invalid IFSC code format'
            }
        },
        BranchName: {
            required: false,
            message: {
                required: 'Branch name is required'
            }
        },
        AccountNumber: {
            required: false,
            pattern: /^[0-9]{9,18}$/,
            message: {
                required: 'Account number is required',
                pattern: 'Account number must be 9-18 digits'
            }
        },
        HotelID: {
            required: false,
            // minLength: 1,
            pattern: /^[1-9]\d*$/,
            message: {
                required: 'HotelID is required',
                pattern:'HotelID must be a positive integer'
            }
        },
        RoomIDs: {
            required: false,
            // pattern: /^[1-9]\d*$/,
            message: {
                required: 'RoomIDs is required',
                pattern: 'RoomIDs must be a positive integer'
            }
        },
        DepartmentId: {
            required: false,
            pattern: /^[1-9]\d*$/,
            message: {
                required: 'DepartmentId is required',
                pattern: 'DepartmentId must be a positive integer'
            }
        },
        RoomTypeID: {
            required: false,
            pattern: /^[1-9]\d*$/,
            message: {
                required: 'RoomTypeID is required',
                pattern: 'RoomTypeID must be a positive integer'
            }
        },
        RoomNumber: {
            required: false,
            minLength: 2,
            maxLength: 20,
            // pattern: /^[A-Z0-9\-]+$/,
            message: {
                required: 'Room number is required',
                minLength: 'Room number must be at least 2 characters',
                maxLength: 'Room number cannot exceed 20 characters',
                pattern: 'Room number can only contain letters, numbers and hyphens'
            }
        },
        Floor: {
            required: false,
            pattern: /^[1-9]\d*$/,
            message: {
                required: 'Floor is required',
                pattern: 'Floor must be a positive integer'
            }
        },
        Status: {
            required: false,
            // pattern: /^(Available|Occupied|Maintenance|Out of Order|Pending|Approved|Confirmed|Rejected|Disposed|Hold|Suspended|Cancelled)$/,
            message: {
                pattern: 'Status is required !'
            }
        },
        Notes: {
            required: false,
            maxLength: 500,
            message: {
                maxLength: 'Notes cannot exceed 500 characters'
            }
        },
        ReservationID: {
    required: true,
    pattern: /^[1-9]\d*$/,
    message: {
        required: 'ReservationID is required',
        pattern: 'ReservationID must be a positive integer'
    }
},
ActualCheckInDate: {
        required: false,
        message: {
            required: 'Actual check-in date is required'
        }
    },
CustomerID: {
    required: false,
    pattern: /^[1-9]\d*$/,
    message: {
        required: 'CustomerID is required',
        pattern: 'CustomerID must be a positive integer'
    }
},
CheckInDate: {
    required: false,
    message: {
        required: 'Check-in date is required'
    }
},
CheckOutDate: {
    required: false,
    message: {
        required: 'Check-out date is required'
    }
},
Adults: {
    required: false,
    pattern: /^[1-9]\d*$/,
    message: {
        required: 'Number of adults is required',
        pattern: 'Adults must be a positive integer'
    }
},
RoomRate: {
    required: false,
    pattern: /^\d+(\.\d{1,2})?$/,
    message: {
        required: 'Room rate is required',
        pattern: 'Room rate must be a valid decimal number with up to 2 decimal places'
    }
},
TotalAmount: {
    required: false,
    pattern: /^\d+(\.\d{1,2})?$/,
    message: {
        required: 'Total amount is required',
        pattern: 'Total amount must be a valid decimal number with up to 2 decimal places'
    }
},
GuestName: {
        required: false,
        minLength: 2,
        maxLength: 100,
        message: {
            required: 'Guest name is required',
            minLength: 'Guest name must be at least 2 characters',
            maxLength: 'Guest name cannot exceed 100 characters'
        }
    },
    PaymentMode: {
        required: false,
        minLength: 2,
        maxLength: 100,
        message: {
            required: 'PaymentMode is required',
            minLength: 'PaymentMode must be at least 2 characters',
            maxLength: 'PaymentMode cannot exceed 100 characters'
        }
    },
    ReservationNumber: {
        required: false,
        minLength: 1,
        maxLength: 100,
        message: {
            required: 'ReservationNumber is required',
        }
    },


    };

 static validate(reqBody, requiredFields = []) {
        const errors = [];

        // 1. Check required fields are present and not empty
        requiredFields.forEach(field => {
            // Safer way to check if property exists
            if (!Object.prototype.hasOwnProperty.call(reqBody, field) || 
                reqBody[field] === null || 
                reqBody[field] === undefined || 
                reqBody[field].toString().trim() === '') {
                errors.push(`${field} is required`);
            }
        });

        // 2. Validate all fields in request body that have validation rules
        // BUT skip fields that already failed required validation
        for (const [field, value] of Object.entries(reqBody)) {
            if (this.validationRules[field]) {
                // Skip validation if this field is required and already failed
                const isRequiredAndFailed = requiredFields.includes(field) && 
                    (!value || value.toString().trim() === '');
                
                if (!isRequiredAndFailed) {
                    const fieldErrors = this.validateField(field, value);
                    if (fieldErrors.length > 0) {
                        errors.push(...fieldErrors);
                    }
                }
            }
        }

        return errors;
    }

    static validateField(fieldName, value) {
        const rules = this.validationRules[fieldName];
        const errors = [];

        if (!rules) return errors;

        const stringValue = value ? value.toString().trim() : '';

        // If field is empty and not required, skip validation
        if (stringValue === '' && !rules.required) {
            return errors;
        }

        // Check required field
        if (rules.required && stringValue === '') {
            errors.push(rules.message.required || `${fieldName} is required`);
            return errors; // Return early for required fields
        }

        // Only validate non-empty values
        if (stringValue !== '') {
            // Check min length
            if (rules.minLength && stringValue.length < rules.minLength) {
                errors.push(rules.message.minLength || `${fieldName} must be at least ${rules.minLength} characters`);
            }

            // Check max length
            if (rules.maxLength && stringValue.length > rules.maxLength) {
                errors.push(rules.message.maxLength || `${fieldName} cannot exceed ${rules.maxLength} characters`);
            }

            // Check pattern
            if (rules.pattern && !rules.pattern.test(stringValue)) {
                errors.push(rules.message.pattern || `Invalid ${fieldName} format`);
            }
        }

        return errors;
    }
}