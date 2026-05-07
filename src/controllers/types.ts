type user = {
  id: string;
  email: string;
  password: string;
  role: string;
};

type person = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  phone?: string;
};

type doctor = {
  personId: String;
  userId: String;

  specialty: string;
  cedula: string;
  address?: string;
};

type patient = {
  personId: string;
  userId: string;

  bloodType: string;
  address?: string;
};

export { user, person, doctor, patient };
