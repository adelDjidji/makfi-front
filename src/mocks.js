export const listeEtat = [
    {
      status: "success",
      state:"OK",
      text: "OK",
      active: true
    },
    {
      status: "error",
      state:"Incident",
      text: "Incident",
      active: false
    },
    {
      status: "default",
      state: "NonFait",
      text: "Non fait",
      active: false
    }
  ];

 export  const list2_Interventions = [
    {
      id: 1,
      dateTime: "2020-02-11 10:12:00",
      comment: "Netoyage bien fait.",
      active: true,
      status: "success"
    },
    {
      id: 2,
      dateTime: "2020-01-12 10:00:00",
      comment: "Moyenement propre",
      active: false,
      status: "success"
    },
    {
      id: 3,
      dateTime: "2020-01-22 12:30:00",
      comment: "Bon travail",
      active: true,
      status: "success"
    },
    {
      id: 4,
      dateTime: "2020-01-24 22:30:00",
      comment: "Tres mal fait !!!",
      active: false,
      status: "eror"
    }
  ];
  export const API_URL = "https://makfi.azurewebsites.net/api/"