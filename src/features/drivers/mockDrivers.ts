import type { Driver } from "../../types/driver";

export const DRIVER_SEED: Array<Pick<
  Driver,
  "id" | "name" | "licenseNumber" | "phone" | "email" | "status"
>> = [
  {
    id: "D-0001",
    name: "Alex Carter",
    licenseNumber: "LIC-100001",
    phone: "+355 690 101 201",
    email: "alex.carter@fleetco.test",
    status: "ACTIVE",
  },
  {
    id: "D-0002",
    name: "Mia Johnson",
    licenseNumber: "LIC-100002",
    phone: "+355 690 102 202",
    email: "mia.johnson@fleetco.test",
    status: "ACTIVE",
  },
  {
    id: "D-0003",
    name: "Noah Smith",
    licenseNumber: "LIC-100003",
    phone: "+355 690 103 203",
    email: "noah.smith@fleetco.test",
    status: "ON_LEAVE",
  },
  {
    id: "D-0004",
    name: "Emma Brown",
    licenseNumber: "LIC-100004",
    phone: "+355 690 104 204",
    email: "emma.brown@fleetco.test",
    status: "ACTIVE",
  },
  {
    id: "D-0005",
    name: "Liam Wilson",
    licenseNumber: "LIC-100005",
    phone: "+355 690 105 205",
    email: "liam.wilson@fleetco.test",
    status: "TERMINATED",
  },
  {
    id: "D-0006",
    name: "Olivia Taylor",
    licenseNumber: "LIC-100006",
    phone: "+355 690 106 206",
    email: "olivia.taylor@fleetco.test",
    status: "ACTIVE",
  },
];
