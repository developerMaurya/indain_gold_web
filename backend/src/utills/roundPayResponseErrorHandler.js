export class RoundPayResponseErrorHandler {
    static getErrorMessage(errorCode) {
        const response = {
            success: false,
            message: ''
        };

        switch (errorCode) {
            case "412":
                response.message = "Complete details of the error";
                break;
            case "158":
                response.message = "Complete details of the error";
                break;
            case "270":
                response.message = "Service has been temporarily suspended for your account. For more details contact customer care";
                break;
            case "106":
                response.message = "Account Suspended - Contact Account Manager";
                break;
            case "142":
                response.message = "Account/Mobile length should be between minimum and maximum limits";
                break;
            case "146":
                response.message = "Account/Mobile should start with specified characters";
                break;
            case "141":
                response.message = "Acquiring Bank CBS or Node Offline";
                break;
            case "225":
                response.message = "Add Beneficiary Limit exceeds";
                break;
            case "239":
                response.message = "Amount Should Be Positive!";
                break;
            case "242":
                response.message = "Bad Voucher or This Denomination Is Not Allowed";
                break;
            case "127":
                response.success = true;
                response.message = "Beneficiary Added Successfully";
                break;
            case "261":
                response.message = "Beneficiary Already Activated";
                break;
            case "262":
                response.message = "Beneficiary Already Deleted";
                break;
            case "123":
                response.message = "Beneficiary Already Exist";
                break;
            case "419":
                response.message = "Beneficiary bank rejected credit. Example: name missing/does not match";
                break;
            case "124":
                response.message = "Beneficiary Deactivated/Deleted";
                break;
            case "258":
                response.message = "Beneficiary Name Format Is Invalid. Special Character Not Allowed";
                break;
            case "218":
                response.message = "Beneficiary Not Found";
                break;
            case "156":
                response.message = "Beneficiary's Monthly/Daily Limit Exceed";
                break;
            case "267":
                response.message = "Bill Due Date Has Expired - Bill Details Are Not Available";
                break;
            case "282":
                response.message = "Bill Fetch Is mandatory for this Biller";
                break;
            case "413":
                response.message = "Bill Fetch Service Not Available For This Provider";
                break;
            case "281":
                response.message = "Bill Not Available for Payment, Please Try Again After Some Time";
                break;
            case "417":
                response.message = "Bill Not Available for Payment. Please Try Again After Some Time";
                break;
            case "129":
                response.message = "Commercials Not Defined Please Contact Account Manager";
                break;
            case "269":
                response.message = "Commercials Not Defined Properly Please Contact Account Manager";
                break;
            case "422":
                response.message = "Currently We Don't Have Voucher Of This Amount In Stock. Please Try With Another Amount";
                break;
            case "216":
                response.success = true;
                response.message = "Detail Found Successfully";
                break;
            case "235":
                response.success = true;
                response.message = "Dispute Logged Successfully";
                break;
            case "109":
                response.message = "Duplicate Reference Id";
                break;
            case "119":
                response.message = "Duplicate Sender Mobile";
                break;
            case "151":
                response.message = "Failure NPCI Connection";
                break;
            case "222":
                response.message = "IMPS Not Allowed";
                break;
            case "128":
                response.message = "Insufficient Fund";
                break;
            case "230":
                response.message = "Internal Processing Error, Try Later";
                break;
            case "408":
                response.message = "Internal Processing Error, Try Later";
                break;
            case "145":
                response.message = "Invalid Account Key";
                break;
            case "401":
                response.message = "Invalid Account Key";
                break;
            case "211":
                response.message = "Invalid Access";
                break;
            case "115":
                response.message = "Invalid Address";
                break;
            case "117":
                response.message = "Invalid Aadhaar Number";
                break;
            case "260":
                response.message = "Invalid Age - Age Must Be Between 18 - 65";
                break;
            case "108":
                response.message = "Invalid API Reference ID";
                break;
            case "220":
                response.message = "Invalid Bank";
                break;
            case "122":
                response.message = "Invalid Bank Code";
                break;
            case "254":
                response.message = "Invalid Beneficiary Bank Account number";
                break;
            case "257":
                response.message = "Invalid Beneficiary Details";
                break;
            case "131":
                response.message = "Invalid Beneficiary ID";
                break;
            case "155":
                response.message = "Invalid Bill Fetch Result ID";
                break;
            case "126":
                response.message = "Invalid Channel";
                break;
            case "253":
                response.message = "Invalid Combination of Customer Details";
                break;
            case "237":
                response.message = "Invalid Customer ID";
                break;
            case "203":
                response.message = "Invalid Date of Birth";
                break;
            case "259":
                response.message = "Invalid Date Of Birth - Format Should be DD MMM YYYY";
                break;
            case "208":
                response.message = "Invalid District ID";
                break;
            case "210":
                response.message = "Invalid Email ID";
                break;
            case "204":
                response.message = "Invalid Geo Code";
                break;
            case "405":
                response.message = "Invalid Geocode";
                break;
            case "263":
                response.message = "Invalid Latitude or Longitude";
                break;
            case "205":
                response.message = "Invalid Mac Id";
                break;
            case "112":
                response.message = "Invalid Mobile Number";
                break;
            case "102":
                response.message = "Invalid or Incomplete Request Parameter";
                break;
            case "272":
                response.message = "Invalid or Incomplete Request Parameter Optional 1";
                break;
            case "273":
                response.message = "Invalid or Incomplete Request Parameter Optional 2";
                break;
            case "274":
                response.message = "Invalid or Incomplete Request Parameter Optional 3";
                break;
            case "275":
                response.message = "Invalid or Incomplete Request Parameter Optional 4";
                break;
            case "202":
                response.message = "Invalid OTP";
                break;
            case "232":
                response.message = "Invalid Outlet ID";
                break;
            case "410":
                response.message = "Invalid Outlet ID";
                break;
            case "116":
                response.message = "Invalid PAN Number";
                break;
            case "402":
                response.message = "Invalid Parameter Billing Unit";
                break;
            case "403":
                response.message = "Invalid Parameter Processing Cycle";
                break;
            case "105":
                response.message = "Invalid Parameter Value";
                break;
            case "246":
                response.message = "Invalid Payment Mode";
                break;
            case "247":
                response.message = "Invalid Payment Mode Details";
                break;
            case "114":
                response.message = "Invalid Pincode";
                break;
            case "209":
                response.message = "Invalid Qualification ID";
                break;
            case "301":
                response.message = "Invalid Request ID";
                break;
            case "113":
                response.message = "Invalid Sender Name";
                break;
            case "118":
                response.message = "Invalid Sender Number";
                break;
            case "228":
                response.message = "Invalid Service Provider";
                break;
            case "406":
                response.message = "Invalid Service Provider";
                break;
            case "206":
                response.message = "Invalid Shop Type ID";
                break;
            case "207":
                response.message = "Invalid State ID";
                break;
            case "101":
                response.message = "Invalid Token";
                break;
            case "157":
                response.message = "Invalid Transaction Amount: Try With Different Amount";
                break;
            case "271":
                response.message = "Invalid UPI VPA - Virtual Private Address";
                break;
            case "252":
                response.message = "Invalid Vehicle Registration Number";
                break;
            case "284":
                response.message = "It seems Postpaid Number";
                break;
            case "223":
                response.success = true;
                response.message = "KYC Not Completed. Please complete your KYC to use this Service";
                break;
            case "221":
                response.message = "NEFT Not Allowed";
                break;
            case "154":
                response.message = "No Payment(s) Due";
                break;
            case "404":
                response.message = "No Payment(s) Due";
                break;
            case "159":
                response.message = "No Plans Found with this Amount On This Number";
                break;
            case "290":
                response.message = "Non Roffer Transaction Not Allowed Please Contact Administrator";
                break;
            case "201":
                response.message = "OTP Expired";
                break;
            case "217":
                response.success = true;
                response.message = "OTP for verification has been sent successfully";
                break;
            case "226":
                response.message = "OTP Limit exceeds";
                break;
            case "227":
                response.success = true;
                response.message = "OTP Verified Successfully";
                break;
            case "278":
                response.message = "This IFSC Code Has Been Suspended by RBI Due to Bank Merger, Please Enter New Updated IFSC Code";
                break;
            case "224":
                response.message = "This Mobile Belongs To Another Provider - Unsupported Network";
                break;
            case "238":
                response.message = "This Plan is Not Valid for Your Number. Please Choose another Suitable Plan";
                break;
            case "264":
                response.message = "Transaction Already Refunded";
                break;
            case "136":
                response.message = "Transaction Amount Should be between minimum and maximum";
                break;
            case "243":
                response.message = "Transaction cannot be completed! Try again later...";
                break;
            case "268":
                response.message = "Transaction Cannot Mark Dispute Please Contact Helpdesk";
                break;
            case "302":
                response.message = "Transaction Failed - Complete details of the error";
                break;
            case "265":
                response.message = "Transaction Not Available for Refund";
                break;
            case "138":
                response.success = true;
                response.message = "Transaction Pending - Please Check With beneficiary";
                break;
            case "303":
                response.message = "Transaction Status Updated Refund";
                break;
            case "200":
                response.success = true;
                response.message = "Transaction Successful";
                break;
            case "285":
                response.message = "Unable to Connect to BOU";
                break;
            case "400":
                response.message = "Unable to get bill details. Please try again after few minutes";
                break;
            case "241":
                response.message = "SUCCESS mode of request";
                break;
            case "240":
                response.message = "SUCCESS request!";
                break;
            case "219":
                response.message = "Unable to Verify Beneficiary Please Check Your Data and Verify Again";
                break;
            case "143":
                response.message = "Unknown Error - Please Try Again Later";
                break;
            case "414":
                response.message = "Vehicle Registered Number entered is either invalid or does not exist";
                break;
            case "276":
                response.message = "Verification Service is Not Available for this Bank";
                break;
            case "420":
                response.message = "Wrong Combination of Beneficiary ID IFSC Code and Account Number";
                break;
            case "104":
                response.message = "You are not authorized to use this service";
                break;
            case "125":
                response.message = "You Cannot Add More Beneficiary";
                break;
            case "130":
                response.message = "Sender's Monthly/Daily limit breached";
                break;
            case "111":
                response.message = "Sender Already Exist";
                break;
            case "120":
                response.success = true;
                response.message = "Sender Created Successfully";
                break;
            case "110":
                response.message = "Sender Not Found";
                break;
            case "133":
                response.message = "Service Error - Your transfer request was unsuccessful due to invalid details";
                break;
            case "137":
                response.message = "Service Error - Complete Details of the Error";
                break;
            case "152":
                response.message = "Service Error - Service Provider Down";
                break;
            case "149":
                response.message = "Service Error - Transaction Is Not Permitted to Account";
                break;
            case "148":
                response.message = "Service Error - Your Transfer Request Was Unsuccessful as the Beneficiary Account Is Closed";
                break;
            case "134":
                response.message = "Service Error - Your Transfer Request Was Unsuccessful as the Beneficiary Account Is Frozen";
                break;
            case "147":
                response.message = "Service Error - Your Transfer Request Was Unsuccessful as the Beneficiary Account Is NRE Account";
                break;
            case "135":
                response.message = "Service Error - Your Transfer Was Declined by the Beneficiary Bank. Please Try Again After Some Time";
                break;
            case "407":
                response.message = "Service Provider Error, Try Later";
                break;
            case "229":
                response.message = "Service Provider Error, Try Later";
                break;
            case "107":
                response.message = "Session Key is Invalid or Expired";
                break;
            case "244":
                response.message = "Something went wrong!";
                break;
            case "256":
                response.message = "Subscribe Id Does Not Exist";
                break;
            case "287":
                response.message = "The account you are trying to recharge is currently suspended. Kindly ask the customer to reactivate the number and then try to recharge";
                break;
            case "233":
                response.message = "The Bill for This Consumer Number Has Not Been Generated Yet";
                break;
            case "411":
                response.message = "The Bill for This Consumer Number Has Not Been Generated Yet";
                break;
            case "421":
                response.message = "The biller is having a technical issue. Please try later";
                break;
            case "280":
                response.message = "This Biller is Not Allowed For AGT-Physical Agent Channel";
                break;
            case "288":
                response.message = "You have an amount due on your account. Please clear the outstanding balance and then proceed with the recharge";
                break;
            case "213":
                response.success = true;
                response.message = "Outlet data and KYC is under screening. Will take 24-48 hours to get approved";
                break;
            case "231":
                response.message = "Outlet Data Incorrect";
                break;
            case "409":
                response.message = "Outlet Data Incorrect";
                break;
            case "418":
                response.message = "Partial Payment Not Allowed Please Pay Exact Bill Amount";
                break;
            case "215":
                response.message = "Partial Registration- Please verify Sender with OTP";
                break;
            case "416":
                response.success = true;
                response.message = "Payment Received for the Billing Period - No Bill Due";
                break;
            case "279":
                response.success = true;
                response.message = "Payment Received for the Billing Period - No Bill Due";
                break;
            case "283":
                response.message = "Please check Your Transaction Account. It seems Prepaid Number";
                break;
            case "121":
                response.message = "Please Enter Correct IFSC code";
                break;
            case "236":
                response.message = "Please Try After Some Time - IAB";
                break;
            case "234":
                response.message = "Please Try Again After 5 Min - AOB";
                break;
            case "255":
                response.message = "PSA is Partially Registered in UTI. Please Login On UTI Portal and Purchase again";
                break;
            case "248":
                response.message = "Recharge Account is Suspended Please Reactivate and Try to Recharge Again";
                break;
            case "266":
                response.message = "Recipient mobile number is required";
                break;
            case "415":
                response.message = "Refill booking allowed after 15 days of the last cylinder delivery";
                break;
            case "245":
                response.message = "Repeat API Request ID found error!";
                break;
            case "100":
                response.message = "Request Accepted";
                break;
            case "103":
                response.message = "Request From SUCCESS IP";
                break;
            case "140":
                response.message = "Request Time Out from Bank";
                break;
            case "212":
                response.message = "Required Document for This Service Is Not Completed";
                break;
            case "289":
                response.message = "Resendable - IAB";
                break;
            case "150":
                response.message = "Same Transaction Cannot Accept Within";
                break;
            default:
                response.message = errorCode ? `Error: ${errorCode}` : 'Unknown error occurred';
                break;
        }

        return response;
    }
}