export const typeTyping = `type Geo = {
    lat: string;
    lng: string;
};

type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
};

type Company = {
    name: string;
    catchPhrase: string;
    bs: string;
};

type UserResponse = {
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
};`;

export const interfaceTyping = `
interface Geo {
    lat: string;
    lng: string;
}

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

interface UserResponse {
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}`;

export const correctCode = [
  `class UserApi {
    private endpoint: string;
    private users: User[];

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.users = [];
    }

    async fetchUsers(): Promise<void> {
        try {
            const response = await fetch(this.endpoint);
            if (!response.ok) {
              console.error('Error fetching users:', error.message);
            }
            const data: User = await response.json();
            this.users.push(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    async performRequests() {
        for (let i = 0; i < 3; i++) {
            await this.fetchUsers();
        }
        console.log(this.users);
    }
} const userApi = new UserApi('https://interview-api-pi.vercel.app/api/users');
userApi.performRequests();`,
  `class UserApi {
    private results: UserResponse[] = [];

    fetchData() {
        const fetchPromise = (url: string) => fetch(url).then(res => res.json());

        Promise.all([
            fetchPromise('https://interview-api-pi.vercel.app/api/users'),
            fetchPromise('https://interview-api-pi.vercel.app/api/users'),
            fetchPromise('https://interview-api-pi.vercel.app/api/users')
        ]).then(data => {
            this.results = data.flat();
            console.log(this.results);
        }).catch(error => console.error(error));
    }
}`,
  `
class UserApi {
    private results: UserResponse[] = [];
    private requestQueue: Promise<void>[] = [];

    fetchData() {
        for (let i = 0; i < 3; i++) {
            this.requestQueue.push(this.makeRequest());
        }

        Promise.all(this.requestQueue)
            .then(() => console.log(this.results))
            .catch(error => console.error(error));
    }

    async makeRequest() {
        const response = await fetch('https://interview-api-pi.vercel.app/api/users');
        const data = await response.json();
        this.results.push(...data);
    }
}`,
  `class ApiClient {
    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    endpoint: string = ""
    store: any[] = []


    async fetchMultiple(){
        try {
            for (let i = 0; i < 3; i++) {
                const response = await fetch(this.endpoint)
    
                const data = await response.json()
    
                this.store.push(data)
            }
    
            console.log(this.store)
        } catch (error) {
            console.error(error)
        }
     
    }
}

const apiClient = new ApiClient("https://interview-api-pi.vercel.app/api/users")

apiClient.fetchMultiple()`,
];
