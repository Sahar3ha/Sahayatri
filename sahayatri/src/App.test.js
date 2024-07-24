import axios from "axios";
import register_data from "./utils/register_json";
import login_data from "./utils/login_json";
import vehicles_data from "./utils/vehicles_json";
import add_vehicles from "./utils/add_vehicles_json";
import reviews from "./utils/review_json";
import notification from "./utils/notifications_json";
import favourite_data from "./utils/favourites_json";
import fav from "./utils/favourite_json";
import feedback from "./utils/feedback_json";


const baseUrl = "http://localhost:5000";

describe("App",()=>{
    it("Register", async ()=>{
        const response = await axios.post(`${baseUrl}/api/users/register`,register_data);
        if (response.data.success === true) {
            expect(response.data.success).toEqual(true);
        } else {
            expect(response.data.success).toEqual(false);
        }
    })

    it("Login",async()=>{
        const response = await axios.post(`${baseUrl}/api/users/login`,login_data);
        if (response.data.success === true) {
            expect(response.data.success).toEqual(true);
        } else {
            expect(response.data.success).toEqual(false);
        }
    })

    it("Fetch all Feedback",async()=>{
        const response = await axios.get(`${baseUrl}/api/admin/get_feedback`);
        expect(response.data.success).toEqual(true);
        expect(response.data.reviews).toBeDefined();
        response.data.reviews.forEach((review,index)=>{
            expect(review.review).toEqual(vehicles_data[index].review);
        });
    })
    it("Add Vehicle",async()=>{
        const response = await axios.post(`${baseUrl}/api/admin/add_vehicles`,add_vehicles);
        if (response.data.success === true) {
            expect(response.data.success).toEqual(true);
        } else {
            expect(response.data.success).toEqual(false);
        }
    })
    it("Fetch all notification",async()=>{
        const response = await axios.get(`${baseUrl}/api/admin/get_notification`);
        expect(response.data.success).toEqual(true);
        expect(response.data.notification).toBeDefined();
        response.data.notification.forEach((not,index)=>{
            expect(not.notification).toEqual(notification[index].notification);
        });
    })
    it("Fetch all vehicles",async()=>{
        const response = await axios.get(`${baseUrl}/api/admin/get_vehicles`);
        console.log(response);
        expect(response.data.success).toEqual(true);
        expect(response.data.vehicles).toBeDefined();
        response.data.vehicles.forEach((vehicle,index)=>{
            expect(vehicle.vehicles).toEqual(vehicles_data[index].vehicles);
        });
    })
    it("Fetch all Favourites",async()=>{
        const response = await axios.get(`${baseUrl}/api/users/get_favourite/65e349775f4331ebcd2d7752`);
        expect(response.data.success).toEqual(true);
        expect(response.data.favourites).toBeDefined();
        response.data.favourites.forEach((favourite,index)=>{
            expect(favourite.favourites).toEqual(favourite_data[index].favourites);
        });
    })
    it("Fetch all Activated vehicles",async()=>{
        const response = await axios.get(`${baseUrl}/api/admin/getActivatedVehicles`);
        console.log(response)
        expect(response.data.success).toEqual(true);
        expect(response.data.vehicles).toBeDefined();
        response.data.vehicles.forEach((vehicle,index)=>{
            expect(vehicle.vehicles).toEqual(vehicles_data[index].vehicles);
        });
    })
    it("Add feedback",async()=>{
        const response = await axios.post(`${baseUrl}/api/users/create_feedback/65e416fe5f4331ebcd2d791b`,feedback);
        if (response.data.success === true) {
            expect(response.data.success).toEqual(true);
        } else {
            expect(response.data.success).toEqual(false);
        }
    })
    it("Add favourite",async()=>{
        const response = await axios.post(`${baseUrl}/api/users/create_favourite`,fav);
        if (response.data.success === true) {
            expect(response.data.success).toEqual(true);
        } else {
            expect(response.data.success).toEqual(false);
        }
    })
});