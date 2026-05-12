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

type medHistory = {
  patientId: string;
  doctorId: string;
  type: string;
  details?: string;
  date?: Date;
};

export { user, person, doctor, patient, medHistory };
