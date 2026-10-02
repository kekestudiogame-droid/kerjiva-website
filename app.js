const SUPABASE_URL = "https://ksqrimmecpriyepsuclc.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_xvPQL9oniSRwZoqmSc5W4A_NS9ldWIL";
// ================= SUPABASE AUTH CLIENT =================

const supabaseAuth =
  window.supabase.createClient(
    SUPABASE_URL.replace("/rest/v1/", ""),
    SUPABASE_KEY,
    {
      auth: {
      flowType: "implicit",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      }
    }
  );

// ==================================================
// SUPABASE AUTH SESSION
// ==================================================
supabaseAuth.auth.onAuthStateChange(
  (event, session) => {

    console.log("AUTH EVENT:", event);

    // ==================================================
    // PASSWORD RECOVERY
    // JANGAN DIUBAH
    // ==================================================
    if (event === "PASSWORD_RECOVERY") {

      console.log(
        "PASSWORD RECOVERY TERDETEKSI",
        session
      );

      showResetPasswordForm();

      return;
    }

    // ==================================================
    // SINKRONKAN SESSION SUPABASE KE LOCALSTORAGE KERJIVA
    // ==================================================
    if (
      session &&
      session.access_token &&
      session.user
    ) {

      localStorage.setItem(
        "kerjivaAccessToken",
        session.access_token
      );

      localStorage.setItem(
        "kerjivaUser",
        JSON.stringify(session.user)
      );

    
    }

  }
);

const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

const SUPABASE_JOBS_URL = `${SUPABASE_URL}jobs`;
const SUPABASE_APPLICATIONS_URL = `${SUPABASE_URL}applications`;
let jobs = [];

async function loadJobsFromDatabase() {
  try {
    const response = await fetch(
      `${SUPABASE_JOBS_URL}?status=eq.published&select=*`,
      {
        method: "GET",
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();

    jobs = data.map(job => ({
      ...job,

      title: job.title || "",

      company:
        job.company ||
        job.company_name ||
        "Perusahaan",

      location:
        job.location ||
        job.city ||
        "",

      category:
        job.category ||
        "",

      type:
        job.type ||
        job.job_type ||
        "",

      salary:
        job.salary ||
        "",

      initials:
        (
          job.company ||
          job.company_name ||
          "P"
        )
          .substring(0, 2)
          .toUpperCase()
    }));

    // =====================================================
    // SATU JALUR DATA FINAL
    // renderJobs menangani translation + tampilan
    // =====================================================

    await renderJobs(jobs);

    console.log(
      "LOWONGAN DARI DATABASE:",
      jobs
    );

  } catch (error) {

    console.error(
      "Gagal mengambil lowongan:",
      error
    );

    jobs = [];

    await renderJobs([]);
  }
}
const jobTypes = [
  "Staff Administrasi",
  "Admin Kantor",
  "Admin Operasional",
  "Admin Data",
  "Data Entry",
  "Sekretaris",
  "Personal Assistant",
  "Executive Assistant",
  "Receptionist",
  "Front Office Staff",
  "Office Assistant",
  "Office Manager",
  "Document Controller",
  "Staff Pengarsipan",
  "Staff Administrasi Umum",
  "Admin Penjualan",
  "Admin Pembelian",
  "Admin Gudang",
  "Admin Proyek",
  "customer Service Admin",

  "Staff Akuntansi",
  "Accounting Admin",
  "Junior Accountant",
  "Senior Accountant",
  "Accounting Supervisor",
  "Accounting Manager",
  "Staff Keuangan",
  "Finance Admin",
  "Finance Officer",
  "Finance Supervisor",
  "Finance Manager",
  "Financial Analyst",
  "Payroll Staff",
  "Payroll Officer",
  "Tax Staff",
  "Tax Accountant",
  "Tax Consultant",
  "Auditor Internal",
  "Auditor Eksternal",
  "Credit Analyst",

  "Marketing Staff",
  "Marketing Officer",
  "Marketing Executive",
  "Marketing Supervisor",
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Digital Marketing Officer",
  "Social Media Specialist",
  "Social Media Officer",
  "Content Marketing Specialist",
  "SEO Specialist",
  "SEM Specialist",
  "Brand Specialist",
  "Brand Manager",
  "Product Marketing Specialist",
  "Marketing Communication Staff",
  "Public Relations Officer",
  "Sales Staff",
  "Sales Executive",
  "Sales Representative",
  "Sales Supervisor",
  "Sales Manager",
  "Account Executive",
  "Account Manager",
  "Business Development Executive",

  "IT Support",
  "IT Staff",
  "IT Administrator",
  "System Administrator",
  "Network Administrator",
  "Network Engineer",
  "Software Engineer",
  "Software Developer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Android Developer",
  "iOS Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Analyst",
  "Data Scientist",
  "Database Administrator",
  "Cyber Security Specialist",
  "Information Security Analyst",
  "QA / Software Tester",
  "UI/UX Designer",
  "IT Project Manager",
    "Purchasing Staff",
  "Purchasing Officer",
  "Purchasing Supervisor",
  "Purchasing Manager",
  "Procurement Staff",
  "Procurement Officer",
  "Procurement Specialist",
  "Procurement Supervisor",
  "Procurement Manager",
  "Buyer",
  "Strategic Sourcing Specialist",
  "Supply Chain Staff",
  "Supply Chain Analyst",
  "Supply Chain Coordinator",
  "Supply Chain Supervisor",
  "Supply Chain Manager",
  "Logistics Staff",
  "Logistics Coordinator",
  "Logistics Officer",
  "Logistics Supervisor",
  "Logistics Manager",
  "Warehouse Staff",
  "Warehouse Operator",
  "Warehouse Coordinator",
  "Warehouse Supervisor",
  "Warehouse Manager",
  "Inventory Staff",
  "Inventory Control Staff",
  "Inventory Analyst",
  "Inventory Supervisor",

  "Production Staff",
  "Production Operator",
  "Production Technician",
  "Production Supervisor",
  "Production Manager",
  "Manufacturing Staff",
  "Manufacturing Engineer",
  "Process Engineer",
  "Industrial Engineer",
  "Maintenance Technician",
  "Maintenance Engineer",
  "Maintenance Supervisor",
  "Quality Control Staff",
  "Quality Control Inspector",
  "Quality Control Analyst",
  "Quality Assurance Staff",
  "Quality Assurance Specialist",
  "Quality Assurance Manager",
  "HSE Staff",
  "HSE Officer",
  "Safety Officer",
  "Safety Supervisor",
  "Health and Safety Manager",
  "Machine Operator",
  "CNC Operator",
  "Production Planner",
  "Production Planner Supervisor",
  "Production Coordinator",
  "Factory Supervisor",
  "Factory Manager",

  "Human Resources Staff",
  "HR Administrator",
  "HR Officer",
  "HR Generalist",
  "HR Specialist",
  "HR Supervisor",
  "HR Manager",
  "Recruitment Staff",
  "Recruitment Specialist",
  "Recruitment Consultant",
  "Recruitment Supervisor",
  "Talent Acquisition Specialist",
  "Talent Management Specialist",
  "Training Officer",
  "Learning and Development Specialist",
  "Compensation and Benefits Specialist",
  "Industrial Relations Officer",
  "Employee Relations Officer",
  "HR Business Partner",
  "People Operations Specialist",

  "Legal Staff",
  "Legal Officer",
  "Legal Counsel",
  "Corporate Lawyer",
  "Legal Administrator",
  "Compliance Officer",
  "Compliance Specialist",
  "Risk Management Officer",
  "Risk Analyst",
  "Risk Manager",
  "Contract Administrator",
  "Contract Specialist",
  "Company Secretary",
  "Government Relations Officer",

  "Graphic Designer",
  "Visual Designer",
  "Creative Designer",
  "Art Director",
  "Illustrator",
  "Photographer",
  "Videographer",
  "Video Editor",
  "Motion Graphic Designer",
  "Animator",
  "3D Designer",
  "Interior Designer",
  "Fashion Designer",
  "Copywriter",
  "Content Writer",
  "Technical Writer",
  "Editor",
  "Proofreader",

  "Architect",
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Electronics Engineer",
  "Chemical Engineer",
  "Environmental Engineer",
  "Geotechnical Engineer",
  "Structural Engineer",
  "Project Engineer",
  "Site Engineer",
  "Quantity Surveyor",
  "Surveyor",
  "Construction Supervisor",
  "Construction Manager",
  "Site Manager",
  "Project Coordinator",

  "Teacher",
  "Tutor",
  "Private Tutor",
  "Lecturer",
  "Academic Coordinator",
  "School Administrator",
  "School Counselor",
  "Education Consultant",
  "Curriculum Developer",
  "Trainer",
  "Instructor",

  "Nurse",
  "Midwife",
  "Pharmacist",
  "Pharmacy Assistant",
  "Medical Assistant",
  "Medical Secretary",
  "Laboratory Technician",
  "Radiology Technician",
  "Dental Assistant",
  "Physiotherapist",
  "Nutritionist",
  "Psychologist",
  "Caregiver",
  "Home Caregiver",
  "Healthcare Administrator",

  "Driver",
  "Personal Driver",
  "Truck Driver",
  "Delivery Driver",
  "Courier",
  "Courier Coordinator",
  "Dispatcher",
  "Fleet Administrator",
  "Fleet Supervisor",
  "Fleet Manager",
  "Motorcycle Courier",

  "Waiter",
  "Waitress",
  "Barista",
  "Chef",
  "Cook",
  "Kitchen Staff",
  "Kitchen Supervisor",
  "Restaurant Supervisor",
  "Restaurant Manager",
  "Hotel Staff",
  "Hotel Receptionist",
  "Housekeeping Staff",
  "Housekeeping Supervisor",
  "Event Staff",
  "Event Coordinator",
  "Event Manager"
];
const cities = [
  "Kabupaten Aceh Barat",
  "Kabupaten Aceh Barat Daya",
  "Kabupaten Aceh Besar",
  "Kabupaten Aceh Jaya",
  "Kabupaten Aceh Selatan",
  "Kabupaten Aceh Singkil",
  "Kabupaten Aceh Tamiang",
  "Kabupaten Aceh Tengah",
  "Kabupaten Aceh Tenggara",
  "Kabupaten Aceh Timur",
  "Kabupaten Aceh Utara",
  "Kabupaten Bener Meriah",
  "Kabupaten Bireuen",
  "Kabupaten Gayo Lues",
  "Kabupaten Nagan Raya",
  "Kabupaten Pidie",
  "Kabupaten Pidie Jaya",
  "Kabupaten Simeulue",
  "Kota Banda Aceh",
  "Kota Langsa",
  "Kota Lhokseumawe",
  "Kota Sabang",
  "Kota Subulussalam",
    "Kabupaten Asahan",
  "Kabupaten Batu Bara",
  "Kabupaten Dairi",
  "Kabupaten Deli Serdang",
  "Kabupaten Humbang Hasundutan",
  "Kabupaten Karo",
  "Kabupaten Labuhanbatu",
  "Kabupaten Labuhanbatu Selatan",
  "Kabupaten Labuhanbatu Utara",
  "Kabupaten Langkat",
  "Kabupaten Mandailing Natal",
  "Kabupaten Nias",
  "Kabupaten Nias Barat",
  "Kabupaten Nias Selatan",
  "Kabupaten Nias Utara",
  "Kabupaten Padang Lawas",
  "Kabupaten Padang Lawas Utara",
  "Kabupaten Pakpak Bharat",
  "Kabupaten Samosir",
  "Kabupaten Serdang Bedagai",
  "Kabupaten Simalungun",
  "Kabupaten Tapanuli Selatan",
  "Kabupaten Tapanuli Tengah",
  "Kabupaten Tapanuli Utara",
  "Kabupaten Toba",
  "Kota Binjai",
  "Kota Gunungsitoli",
  "Kota Medan",
  "Kota Padangsidimpuan",
  "Kota Pematangsiantar",
  "Kota Sibolga",
  "Kota Tanjungbalai",
  "Kota Tebing Tinggi",
    "Kabupaten Agam",
  "Kabupaten Dharmasraya",
  "Kabupaten Kepulauan Mentawai",
  "Kabupaten Lima Puluh Kota",
  "Kabupaten Padang Pariaman",
  "Kabupaten Pasaman",
  "Kabupaten Pasaman Barat",
  "Kabupaten Pesisir Selatan",
  "Kabupaten Sijunjung",
  "Kabupaten Solok",
  "Kabupaten Solok Selatan",
  "Kabupaten Tanah Datar",
  "Kota Padang",
  "Kota Padang Panjang",
  "Kota Pariaman",
  "Kota Payakumbuh",
  "Kota Sawahlunto",
  "Kota Solok",
  "Kota Bukittinggi",
    "Kabupaten Bengkalis",
  "Kabupaten Indragiri Hilir",
  "Kabupaten Indragiri Hulu",
  "Kabupaten Kampar",
  "Kabupaten Kepulauan Meranti",
  "Kabupaten Kuantan Singingi",
  "Kabupaten Pelalawan",
  "Kabupaten Rokan Hilir",
  "Kabupaten Rokan Hulu",
  "Kabupaten Siak",
  "Kota Dumai",
  "Kota Pekanbaru",
    "Kabupaten Bintan",
  "Kabupaten Karimun",
  "Kabupaten Kepulauan Anambas",
  "Kabupaten Lingga",
  "Kabupaten Natuna",
  "Kota Batam",
  "Kota Tanjungpinang",
    "Kabupaten Kerinci",
  "Kabupaten Merangin",
  "Kabupaten Sarolangun",
  "Kabupaten Batanghari",
  "Kabupaten Muaro Jambi",
  "Kabupaten Tanjung Jabung Timur",
  "Kabupaten Tanjung Jabung Barat",
  "Kabupaten Tebo",
  "Kabupaten Bungo",
  "Kota Jambi",
  "Kota Sungai Penuh",
    "Kabupaten Banyuasin",
  "Kabupaten Empat Lawang",
  "Kabupaten Lahat",
  "Kabupaten Muara Enim",
  "Kabupaten Musi Banyuasin",
  "Kabupaten Musi Rawas",
  "Kabupaten Musi Rawas Utara",
  "Kabupaten Ogan Ilir",
  "Kabupaten Ogan Komering Ilir",
  "Kabupaten Ogan Komering Ulu",
  "Kabupaten Ogan Komering Ulu Selatan",
  "Kabupaten Ogan Komering Ulu Timur",
  "Kabupaten Penukal Abab Lematang Ilir",
  "Kota Lubuklinggau",
  "Kota Pagar Alam",
  "Kota Palembang",
  "Kota Prabumulih",
    "Kabupaten Bangka",
  "Kabupaten Belitung",
  "Kabupaten Bangka Selatan",
  "Kabupaten Bangka Tengah",
  "Kabupaten Bangka Barat",
  "Kabupaten Belitung Timur",
  "Kota Pangkalpinang",
    "Kabupaten Lampung Barat",
  "Kabupaten Tanggamus",
  "Kabupaten Lampung Selatan",
  "Kabupaten Lampung Timur",
  "Kabupaten Lampung Tengah",
  "Kabupaten Lampung Utara",
  "Kabupaten Way Kanan",
  "Kabupaten Tulang Bawang",
  "Kabupaten Pesawaran",
  "Kabupaten Pringsewu",
  "Kabupaten Mesuji",
  "Kabupaten Tulang Bawang Barat",
  "Kabupaten Pesisir Barat",
  "Kota Bandar Lampung",
  "Kota Metro",
    "Kabupaten Bengkulu Selatan",
  "Kabupaten Bengkulu Tengah",
  "Kabupaten Bengkulu Utara",
  "Kabupaten Kaur",
  "Kabupaten Kepahiang",
  "Kabupaten Lebong",
  "Kabupaten Mukomuko",
  "Kabupaten Rejang Lebong",
  "Kabupaten Seluma",
  "Kota Bengkulu",
    "Kabupaten Administrasi Kepulauan Seribu",
  "Kota Administrasi Jakarta Selatan",
  "Kota Administrasi Jakarta Timur",
  "Kota Administrasi Jakarta Pusat",
  "Kota Administrasi Jakarta Barat",
  "Kota Administrasi Jakarta Utara",
    "Kabupaten Lebak",
  "Kabupaten Pandeglang",
  "Kabupaten Serang",
  "Kabupaten Tangerang",
  "Kota Cilegon",
  "Kota Serang",
  "Kota Tangerang",
  "Kota Tangerang Selatan",
    "Kabupaten Bandung",
  "Kabupaten Bandung Barat",
  "Kabupaten Bekasi",
  "Kabupaten Bogor",
  "Kabupaten Ciamis",
  "Kabupaten Cianjur",
  "Kabupaten Cirebon",
  "Kabupaten Garut",
  "Kabupaten Indramayu",
  "Kabupaten Karawang",
  "Kabupaten Kuningan",
  "Kabupaten Majalengka",
  "Kabupaten Pangandaran",
  "Kabupaten Purwakarta",
  "Kabupaten Subang",
  "Kabupaten Sukabumi",
  "Kabupaten Sumedang",
  "Kabupaten Tasikmalaya",
  "Kota Bandung",
  "Kota Banjar",
  "Kota Bekasi",
  "Kota Bogor",
  "Kota Cimahi",
  "Kota Cirebon",
  "Kota Depok",
  "Kota Sukabumi",
  "Kota Tasikmalaya",
    "Kabupaten Banjarnegara",
  "Kabupaten Banyumas",
  "Kabupaten Batang",
  "Kabupaten Blora",
  "Kabupaten Boyolali",
  "Kabupaten Brebes",
  "Kabupaten Cilacap",
  "Kabupaten Demak",
  "Kabupaten Grobogan",
  "Kabupaten Jepara",
  "Kabupaten Karanganyar",
  "Kabupaten Kebumen",
  "Kabupaten Kendal",
  "Kabupaten Klaten",
  "Kabupaten Kudus",
  "Kabupaten Magelang",
  "Kabupaten Pati",
  "Kabupaten Pekalongan",
  "Kabupaten Pemalang",
  "Kabupaten Purbalingga",
  "Kabupaten Purworejo",
  "Kabupaten Rembang",
  "Kabupaten Semarang",
  "Kabupaten Sragen",
  "Kabupaten Sukoharjo",
  "Kabupaten Tegal",
  "Kabupaten Temanggung",
  "Kabupaten Wonogiri",
  "Kabupaten Wonosobo",
  "Kota Magelang",
  "Kota Pekalongan",
  "Kota Salatiga",
  "Kota Semarang",
  "Kota Surakarta",
  "Kota Tegal",
    "Kabupaten Bantul",
  "Kabupaten Gunungkidul",
  "Kabupaten Kulon Progo",
  "Kabupaten Sleman",
  "Kota Yogyakarta",
    "Kabupaten Bangkalan",
  "Kabupaten Banyuwangi",
  "Kabupaten Blitar",
  "Kabupaten Bojonegoro",
  "Kabupaten Bondowoso",
  "Kabupaten Gresik",
  "Kabupaten Jember",
  "Kabupaten Jombang",
  "Kabupaten Kediri",
  "Kabupaten Lamongan",
  "Kabupaten Lumajang",
  "Kabupaten Madiun",
  "Kabupaten Magetan",
  "Kabupaten Malang",
  "Kabupaten Mojokerto",
  "Kabupaten Nganjuk",
  "Kabupaten Ngawi",
  "Kabupaten Pacitan",
  "Kabupaten Pamekasan",
  "Kabupaten Pasuruan",
  "Kabupaten Ponorogo",
  "Kabupaten Probolinggo",
  "Kabupaten Sampang",
  "Kabupaten Sidoarjo",
  "Kabupaten Situbondo",
  "Kabupaten Sumenep",
  "Kabupaten Trenggalek",
  "Kabupaten Tuban",
  "Kabupaten Tulungagung",
  "Kota Batu",
  "Kota Blitar",
  "Kota Kediri",
  "Kota Madiun",
  "Kota Malang",
  "Kota Mojokerto",
  "Kota Pasuruan",
  "Kota Probolinggo",
  "Kota Surabaya",
    "Kabupaten Badung",
  "Kabupaten Bangli",
  "Kabupaten Buleleng",
  "Kabupaten Gianyar",
  "Kabupaten Jembrana",
  "Kabupaten Karangasem",
  "Kabupaten Klungkung",
  "Kabupaten Tabanan",
  "Kota Denpasar",
    "Kabupaten Bima",
  "Kabupaten Dompu",
  "Kabupaten Lombok Barat",
  "Kabupaten Lombok Tengah",
  "Kabupaten Lombok Timur",
  "Kabupaten Lombok Utara",
  "Kabupaten Sumbawa",
  "Kabupaten Sumbawa Barat",
  "Kota Bima",
  "Kota Mataram",
    "Kabupaten Alor",
  "Kabupaten Belu",
  "Kabupaten Ende",
  "Kabupaten Flores Timur",
  "Kabupaten Kupang",
  "Kabupaten Lembata",
  "Kabupaten Malaka",
  "Kabupaten Manggarai",
  "Kabupaten Manggarai Barat",
  "Kabupaten Manggarai Timur",
  "Kabupaten Nagekeo",
  "Kabupaten Ngada",
  "Kabupaten Rote Ndao",
  "Kabupaten Sabu Raijua",
  "Kabupaten Sikka",
  "Kabupaten Sumba Barat",
  "Kabupaten Sumba Barat Daya",
  "Kabupaten Sumba Tengah",
  "Kabupaten Sumba Timur",
  "Kabupaten Timor Tengah Selatan",
  "Kabupaten Timor Tengah Utara",
  "Kota Kupang",
    "Kabupaten Bengkayang",
  "Kabupaten Kapuas Hulu",
  "Kabupaten Kayong Utara",
  "Kabupaten Ketapang",
  "Kabupaten Kubu Raya",
  "Kabupaten Landak",
  "Kabupaten Melawi",
  "Kabupaten Mempawah",
  "Kabupaten Sambas",
  "Kabupaten Sanggau",
  "Kabupaten Sekadau",
  "Kabupaten Sintang",
  "Kota Pontianak",
  "Kota Singkawang",
    "Kabupaten Barito Selatan",
  "Kabupaten Barito Timur",
  "Kabupaten Barito Utara",
  "Kabupaten Gunung Mas",
  "Kabupaten Kapuas",
  "Kabupaten Katingan",
  "Kabupaten Kotawaringin Barat",
  "Kabupaten Kotawaringin Timur",
  "Kabupaten Lamandau",
  "Kabupaten Murung Raya",
  "Kabupaten Pulang Pisau",
  "Kabupaten Seruyan",
  "Kabupaten Sukamara",
  "Kota Palangka Raya",
    "Kabupaten Balangan",
  "Kabupaten Banjar",
  "Kabupaten Barito Kuala",
  "Kabupaten Hulu Sungai Selatan",
  "Kabupaten Hulu Sungai Tengah",
  "Kabupaten Hulu Sungai Utara",
  "Kabupaten Kotabaru",
  "Kabupaten Tabalong",
  "Kabupaten Tanah Bumbu",
  "Kabupaten Tanah Laut",
  "Kabupaten Tapin",
  "Kota Banjarbaru",
  "Kota Banjarmasin",
    "Kabupaten Berau",
  "Kabupaten Kutai Barat",
  "Kabupaten Kutai Kartanegara",
  "Kabupaten Kutai Timur",
  "Kabupaten Mahakam Ulu",
  "Kabupaten Paser",
  "Kabupaten Penajam Paser Utara",
  "Kota Balikpapan",
  "Kota Bontang",
  "Kota Samarinda",
    "Kabupaten Bulungan",
  "Kabupaten Malinau",
  "Kabupaten Nunukan",
  "Kabupaten Tana Tidung",
  "Kota Tarakan",
    "Kabupaten Bolaang Mongondow",
  "Kabupaten Bolaang Mongondow Selatan",
  "Kabupaten Bolaang Mongondow Timur",
  "Kabupaten Bolaang Mongondow Utara",
  "Kabupaten Kepulauan Sangihe",
  "Kabupaten Kepulauan Siau Tagulandang Biaro",
  "Kabupaten Kepulauan Talaud",
  "Kabupaten Minahasa",
  "Kabupaten Minahasa Selatan",
  "Kabupaten Minahasa Tenggara",
  "Kabupaten Minahasa Utara",
  "Kota Bitung",
  "Kota Kotamobagu",
  "Kota Manado",
  "Kota Tomohon",
    "Kota Palu",
  "Kabupaten Banggai",
  "Kabupaten Morowali",
  "Kabupaten Poso",
  "Kabupaten Tolitoli",
    "Kota Makassar",
  "Kota Parepare",
  "Kota Palopo",
  "Kabupaten Gowa",
  "Kabupaten Maros",
  "Kabupaten Bone",
  "Kabupaten Bulukumba",
  "Kabupaten Pinrang",
    "Kota Kendari",
  "Kota Baubau",
  "Kabupaten Kolaka",
  "Kabupaten Konawe",
  "Kabupaten Konawe Selatan",
  "Kabupaten Muna",
    "Kota Gorontalo",
  "Kabupaten Gorontalo",
  "Kabupaten Bone Bolango",
  "Kabupaten Boalemo",
    "Kabupaten Mamuju",
  "Kabupaten Majene",
  "Kabupaten Polewali Mandar",
  "Kabupaten Pasangkayu",
    "Kota Ambon",
  "Kota Tual",
  "Kabupaten Maluku Tengah",
  "Kabupaten Buru",
  "Kabupaten Maluku Tenggara",
    "Kota Ternate",
  "Kota Tidore Kepulauan",
  "Kabupaten Halmahera Barat",
  "Kabupaten Halmahera Selatan",
  "Kabupaten Halmahera Utara",
    "Kota Manokwari",
  "Kabupaten Manokwari",
  "Kabupaten Fakfak",
  "Kabupaten Kaimana",
  "Kabupaten Teluk Bintuni",
  "Kabupaten Teluk Wondama",
    "Kota Sorong",
  "Kabupaten Sorong",
  "Kabupaten Raja Ampat",
  "Kabupaten Sorong Selatan",
    "Kota Jayapura",
  "Kabupaten Jayapura",
  "Kabupaten Biak Numfor",
  "Kabupaten Keerom",
  "Kabupaten Sarmi",
    "Kabupaten Asmat",
  "Kabupaten Boven Digoel",
  "Kabupaten Mappi",
  "Kabupaten Merauke",
    "Kabupaten Deiyai",
  "Kabupaten Dogiyai",
  "Kabupaten Intan Jaya",
  "Kabupaten Mimika",
  "Kabupaten Nabire",
  "Kabupaten Paniai",
  "Kabupaten Puncak",
  "Kabupaten Puncak Jaya",
    "Kabupaten Jayawijaya",
  "Kabupaten Lanny Jaya",
  "Kabupaten Mamberamo Tengah",
  "Kabupaten Nduga",
  "Kabupaten Pegunungan Bintang",
  "Kabupaten Tolikara",
  "Kabupaten Yalimo",
  "Kabupaten Yahukimo",
];

const jobsGrid = document.querySelector("#jobsGrid");
const emptyState = document.querySelector("#emptyState");
const jobCount = document.querySelector("#jobCount");
const categoryFilter = document.querySelector("#categoryFilter");
const keyword = document.querySelector("#keyword");
const locationInput = document.querySelector("#location");

if (locationInput) {
  const cityList = document.querySelector("#cityList");

  if (cityList) {
    cities.forEach(city => {
      const option = document.createElement("option");

      option.value = city;

      const language = localStorage.getItem("siteLanguage") || "id";

      option.textContent = language === "en"
        ? city
            .replace("Kabupaten ", "Regency ")
            .replace("Kota Administrasi ", "Administrative City of ")
            .replace("Kota ", "City of ")
        : city;

      cityList.appendChild(option);
    });
  }
}
// =====================================================
// CITY SUGGESTIONS
// =====================================================
let citySuggestions = document.querySelector("#citySuggestions");

if (locationInput) {

  if (!citySuggestions) {
    citySuggestions = document.createElement("div");
    citySuggestions.id = "citySuggestions";
    citySuggestions.className = "job-suggestions hidden";

    locationInput.parentNode.insertBefore(
      citySuggestions,
      locationInput.nextSibling
    );
  }

  locationInput.addEventListener("input", () => {

    const query = locationInput.value.trim().toLowerCase();
    const language = localStorage.getItem("siteLanguage") || "id";

    if (!query) {
      citySuggestions.innerHTML = "";
      citySuggestions.classList.add("hidden");
      return;
    }

    const matchingCities = cities
      .filter(city =>
        city.toLowerCase().includes(query)
      )
      .slice(0, 8);

    if (matchingCities.length === 0) {
      citySuggestions.innerHTML = "";
      citySuggestions.classList.add("hidden");
      return;
    }

    citySuggestions.innerHTML = `
      <div class="suggestion-header">
        ${language === "en" ? "City Suggestions" : "Saran Kota"}
      </div>

      ${matchingCities.map(city => {
        const displayCity = language === "en"
          ? city
              .replace("Kabupaten ", "Regency ")
              .replace("Kota Administrasi ", "Administrative City of ")
              .replace("Kota ", "City of ")
          : city;

        return `
          <button
            type="button"
            class="job-suggestion-item"
            data-city="${city}"
          >
            <span>${displayCity}</span>
          </button>
        `;
      }).join("")}
    `;
  citySuggestions.classList.remove("hidden");

citySuggestions
  .querySelectorAll(".job-suggestion-item")
  .forEach(button => {
    button.addEventListener("click", () => {
      const selectedCity = button.dataset.city;

      const normalizedCity = selectedCity
        .replace(/^Kabupaten /, "")
        .replace(/^Kota Administrasi /, "")
        .replace(/^Kota /, "");

      locationInput.value = normalizedCity;
      citySuggestions.classList.add("hidden");
    });
  });
  });

  locationInput.addEventListener("focus", () => {
    if (locationInput.value.trim()) {
      locationInput.dispatchEvent(new Event("input"));
    }
  });
}

let hasSearched = false;
async function renderJobs(list = jobs) {
  jobsGrid.innerHTML = "";

  const language =
    localStorage.getItem("siteLanguage") || "id";

  // =====================================================
  // HILANGKAN DUPLIKAT BERDASARKAN ID
  // =====================================================

  const uniqueJobs = Array.from(
    new Map(
      list.map(job => [job.id, job])
    ).values()
  );

  list = uniqueJobs;

  if (jobCount) {
    jobCount.textContent = list.length;
  }


// =====================================================
// EMPTY STATE HASIL PENCARIAN
// =====================================================

if (list.length === 0 && hasSearched) {

  const language =
    localStorage.getItem("siteLanguage") || "id";

  const featuredJob =
    document.querySelector("#featuredJob");

  if (featuredJob) {

    featuredJob.classList.remove("hidden");
    featuredJob.classList.add("empty-search");

    featuredJob.innerHTML = `
      
      <div style="
        font-size:44px;
        margin-bottom:12px;
      ">
        🔎
      </div>

  <h3 style="
      margin:0 0 10px;
      font-size:22px;
      color:#ffffff;
      ">
      ${
      language === "en"
      ? "No Jobs Available"
      : "Belum Ada Lowongan"
       }
   </h3>
      <p style="
        margin:0;
        color:rgba(255,255,255,.88);
        line-height:1.6;
        max-width:300px;
        ">
         ${
          language === "en"
           ? "There are no real job openings available for this search."
           : "Belum ada lowongan nyata yang tersedia untuk pencarian ini."
           }
       </p>

      <p style="
        margin:10px 0 0;
        color:rgba(255,255,255,.72);
        font-size:13px;
        line-height:1.5;
        max-width:300px;
      ">
        ${
          language === "en"
            ? "Please try another job type or city."
            : "Silakan coba jenis pekerjaan atau kota lainnya."
        }
      </p>

    `;
  }
}

// =====================================================
// TERJEMAHAN ENGLISH DARI DATABASE
// HANYA MEMBACA HASIL TERJEMAHAN YANG SUDAH DISIMPAN
// TIDAK MEMANGGIL GEMINI / translate-job
// =====================================================

let displayJobs = list;

if (
  language === "en" &&
  list.length > 0
) {
  displayJobs = list.map(job => ({
    ...job,

    title:
      job.title_en ||
      job.title ||
      "",

    description:
      job.description_en ||
      job.description ||
      "",

    requirements:
      job.requirements_en ||
      job.requirements ||
      job.requirement ||
      "",

    type:
      job.job_type_en ||
      job.job_type ||
      job.type ||
      "",

    category:
      job.category_en ||
      job.category ||
      "",

    salary:
      job.salary_en ||
      job.salary ||
      "",

    experience:
      job.experience_en ||
      job.experience ||
      "",

    education:
      job.education_en ||
      job.education ||
      ""
  }));
}
  // =====================================================
  // TAMPILKAN DAFTAR LOWONGAN
  // =====================================================

 displayJobs.forEach((job, i) => {

    const originalIndex =
      jobs.findIndex(
        originalJob =>
          originalJob.id === job.id
      );

    const card =
      document.createElement("article");

    card.className = "job-card";

    card.innerHTML = `
      <div class="job-top">

        <div class="company-logo">
          ${job.initials || ""}
        </div>

        <span class="pill">
          ${job.type || ""}
        </span>

      </div>

      <h3>
        ${job.title || ""}
      </h3>

      <div class="company">
        ${job.company || ""}
      </div>

      <div class="job-meta">

        <span>
          📍 ${job.location || ""}
        </span>

        <span>
          ▣ ${job.category || ""}
        </span>

      </div>

      <div class="salary">
        ${job.salary || ""}
      </div>

      <div class="job-posted-date">

        ${
          job.created_at
            ? (
                language === "en"

                  ? `Posted ${new Date(
                      job.created_at
                    ).toLocaleString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}`

                  : `Diposting ${new Date(
                      job.created_at
                    ).toLocaleString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}`
              )

            : ""
        }

      </div>

      <div class="job-actions">

      <button data-details="${originalIndex}">
          ${
            language === "en"
              ? "View Details"
              : "Lihat Detail"
          }
        </button>

       <button data-apply="${originalIndex}">
          ${
            language === "en"
              ? "Apply →"
              : "Lamar →"
          }
        </button>

      </div>
    `;

       jobsGrid.appendChild(card);
  });

  // =====================================================
  // SLOT IKLAN HASIL PENCARIAN
  // HANYA SATU SLOT
  // =====================================================

  if (hasSearched && displayJobs.length > 0) {

    const searchAd = document.createElement("div");

    searchAd.style.cssText = `
      width:100%;
      max-width:970px;
      min-height:180px;
      margin:35px auto 10px;
      padding:18px;
      box-sizing:border-box;
      border:1px solid #e2e8f0;
      border-radius:16px;
      background:#ffffff;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      text-align:center;
      box-shadow:0 8px 24px rgba(18,59,109,.06);
    `;

    searchAd.innerHTML = `
      <div style="
        font-size:11px;
        font-weight:700;
        letter-spacing:1.5px;
        color:#94a3b8;
        margin-bottom:10px;
      ">
      ADVERTISEMENT — SLOT 2
      </div>

      <div style="
        width:100%;
        max-width:728px;
        height:90px;
        border:1px dashed #cbd5e1;
        border-radius:10px;
        background:#f8fafc;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#94a3b8;
        font-size:14px;
      ">
     Ruang Iklan Kerjiva — HASIL PENCARIAN
      </div>
    `;

    jobsGrid.appendChild(searchAd);
  }


  // =====================================================
  // KARTU LOWONGAN TERBARU
  // MENGGUNAKAN displayJobs YANG SAMA
  // =====================================================

  const featuredJob =
    document.querySelector(
      "#featuredJob"
    );
  const searchText =
  keyword.value.trim();

const locationText =
  locationInput.value.trim();

  if (
  featuredJob &&
  (
    !hasSearched ||
    displayJobs.length > 0
  )
) {
       
       if (hasSearched && displayJobs.length > 0) {
          featuredJob.classList.remove("hidden");
          featuredJob.classList.remove("empty-search");
         }

    const now = new Date();

    const oneMonthAgo =
      new Date(now);

    oneMonthAgo.setMonth(
      oneMonthAgo.getMonth() - 1
    );

    const recentJobs =
      displayJobs.filter(job => {

        if (!job.created_at) {
          return false;
        }

        const postedDate =
          new Date(job.created_at);

        return postedDate >= oneMonthAgo;
      });

       const latestJob =
           hasSearched
           ? displayJobs[0]
           : [...recentJobs].sort(
           (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )[0];

    // ===================================================
    // TIDAK ADA LOWONGAN TERBARU
    // ===================================================

  if (!latestJob) {

  featuredJob.innerHTML = `
    <div
      style="
        text-align:center;
        padding:30px 15px;
      "
    >

      <div
        style="
          font-size:42px;
          margin-bottom:10px;
        "
      >
        🚀
      </div>

      <h3
        style="
          margin:0 0 8px;
        "
      >
        ${
          language === "en"
            ? "NEWLY LAUNCHED"
            : "BARU LAUNCHING"
        }
      </h3>

      <p
        style="
          margin:0;
          color:#64748b;
        "
      >
        ${
          language === "en"
            ? "Kerjiva is ready to connect job seekers with companies."
            : "Kerjiva siap menghubungkan pencari kerja dengan perusahaan."
        }
      </p>

    </div>
  `;

} else {

// =================================================
// KARTU BIRU
// MEMAKAI latestJob DARI displayJobs YANG SAMA
// =================================================
      const originalIndex =
        jobs.findIndex(
          job =>
            job.id === latestJob.id
        );

      featuredJob.innerHTML = `
        <div
          class="featured-job-card"
          style="
            background:linear-gradient(
              145deg,
              #123b6d 0%,
              #0b2b50 100%
            );
            color:#fff;
            border-radius:22px;
            padding:24px;
            text-align:left;
            box-shadow:
              0 14px 35px
              rgba(18,59,109,.28);
            border:
              1px solid
              rgba(255,255,255,.12);
            position:relative;
            overflow:hidden;
          "
        >

          <div
            style="
              position:absolute;
              width:150px;
              height:150px;
              border-radius:50%;
              background:
                rgba(255,255,255,.06);
              right:-65px;
              top:-65px;
            "
          ></div>

          <div
            style="
              position:relative;
              z-index:1;
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:10px;
              margin-bottom:20px;
            "
          >

            <span
              style="
                background:
                  rgba(255,255,255,.14);
                padding:7px 11px;
                border-radius:999px;
                font-size:11px;
                font-weight:700;
                letter-spacing:.5px;
              "
            >
              ✦ ${
                language === "en"
                  ? "LATEST JOB"
                  : "LOWONGAN TERBARU"
              }
            </span>

            <span
              style="
                background:
                  rgba(255,255,255,.09);
                padding:7px 10px;
                border-radius:999px;
                font-size:11px;
                color:#dbeafe;
              "
            >
              ${latestJob.type || ""}
            </span>

          </div>

          <div
            style="
              position:relative;
              z-index:1;
              width:56px;
              height:56px;
              display:flex;
              align-items:center;
              justify-content:center;
              border-radius:16px;
              background:
                rgba(255,255,255,.13);
              font-size:24px;
              margin-bottom:15px;
            "
          >
            ${latestJob.initials || "💼"}
          </div>

          <div
            style="
              position:relative;
              z-index:1;
            "
          >

            <h3
              style="
                margin:0 0 6px;
                font-size:23px;
                line-height:1.25;
                color:#fff;
              "
            >
              ${latestJob.title || ""}
            </h3>

            <p
              style="
                margin:0 0 16px;
                font-size:14px;
                font-weight:600;
                color:
                  rgba(255,255,255,.78);
              "
            >
              ${latestJob.company || ""}
            </p>

            <div
              style="
                font-size:12px;
                color:
                  rgba(255,255,255,.65);
                margin-bottom:14px;
              "
            >
              ${
                latestJob.created_at
                  ? (
                      language === "en"

                        ? `Posted ${new Date(
                            latestJob.created_at
                          ).toLocaleString(
                            "en-US",
                            {
                              day:"numeric",
                              month:"long",
                              year:"numeric",
                              hour:"2-digit",
                              minute:"2-digit"
                            }
                          )}`

                        : `Diposting ${new Date(
                            latestJob.created_at
                          ).toLocaleString(
                            "id-ID",
                            {
                              day:"numeric",
                              month:"long",
                              year:"numeric",
                              hour:"2-digit",
                              minute:"2-digit"
                            }
                          )}`
                    )

                  : ""
              }
            </div>

            <div
              style="
                display:flex;
                flex-wrap:wrap;
                gap:7px;
                margin-bottom:14px;
              "
            >

              <span
                style="
                  background:
                    rgba(255,255,255,.09);
                  padding:7px 9px;
                  border-radius:8px;
                  font-size:12px;
                  color:#e8f1fb;
                "
              >
                📍 ${latestJob.location || ""}
              </span>

              <span
                style="
                  background:
                    rgba(255,255,255,.09);
                  padding:7px 9px;
                  border-radius:8px;
                  font-size:12px;
                  color:#e8f1fb;
                "
              >
                ▣ ${latestJob.category || ""}
              </span>

            </div>

            <div
              style="
                font-size:14px;
                font-weight:700;
                color:#fff;
                margin-bottom:12px;
              "
            >
              💰 ${
                latestJob.salary ||
                (
                  language === "en"
                    ? "Salary according to company policy"
                    : "Gaji sesuai ketentuan perusahaan"
                )
              }
            </div>

            <p
              style="
                margin:0 0 20px;
                font-size:13px;
                line-height:1.65;
                color:
                  rgba(255,255,255,.72);
                display:-webkit-box;
                -webkit-line-clamp:3;
                -webkit-box-orient:vertical;
                overflow:hidden;
              "
            >
              ${
                latestJob.description ||
                (
                  language === "en"
                    ? "Discover this career opportunity and join this company."
                    : "Temukan peluang karier ini dan bergabung bersama perusahaan."
                )
              }
            </p>

            <div
              style="
                display:flex;
                gap:9px;
              "
            >

              <button
                type="button"
                class="featured-details-btn"
                data-details="${originalIndex}"
                style="
                  flex:1;
                  min-height:44px;
                  border-radius:11px;
                  border:
                    1px solid
                    rgba(255,255,255,.22);
                  background:
                    rgba(255,255,255,.10);
                  color:#fff;
                  font-size:13px;
                  font-weight:700;
                  cursor:pointer;
                "
              >
                ${
                  language === "en"
                    ? "View Details"
                    : "Lihat Detail"
                }
              </button>

              <button
                type="button"
                class="featured-apply-btn"
                data-apply="${originalIndex}"
                style="
                  flex:1;
                  min-height:44px;
                  border-radius:11px;
                  border:1px solid #fff;
                  background:#fff;
                  color:#123b6d;
                  font-size:13px;
                  font-weight:700;
                  cursor:pointer;
                "
              >
                ${
                  language === "en"
                    ? "Apply →"
                    : "Lamar →"
                }
              </button>

            </div>

          </div>

        </div>
      `;
    }
  }

  // =====================================================
  // KEMBALIKAN DATA FINAL
  // =====================================================

  return displayJobs;
}

async function filterJobs() {
  const q = keyword.value.trim().toLowerCase();
  const loc = locationInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;

  // =====================================================
  // INDIKATOR PROSES PENCARIAN
  // =====================================================

  const language =
    localStorage.getItem("siteLanguage") || "id";

const searchFeaturedJobElement =
  document.querySelector("#featuredJob");

  const jobsGridElement =
    document.querySelector("#jobsGrid");

  const loadingHTML = `
    <div
      style="
        text-align:center;
        padding:28px 15px;
      "
    >

      <div
        style="
          font-size:27px;
          line-height:1;
          margin-bottom:9px;
          animation: kerjivaHourglass 1.2s ease-in-out infinite;
        "
      >
        ⏳
      </div>

      <div
        style="
          font-size:14px;
          font-weight:600;
          color:#64748b;
        "
      >
        ${
          language === "en"
            ? "Searching for jobs..."
            : "Mencari lowongan..."
        }
      </div>

    </div>
  `;

if (searchFeaturedJobElement) {
  searchFeaturedJobElement.innerHTML = loadingHTML;
}

  if (jobsGridElement) {
    jobsGridElement.style.opacity = "0.35";
    jobsGridElement.style.transition =
      "opacity .25s ease";
  }

  // =====================================================
  // PROSES PENCARIAN
  // =====================================================

  const searchWords = q
    .split(/\s+/)
    .filter(Boolean);

  const normalizeLocation = (value) =>
    (value || "")
      .toLowerCase()
      .trim()
      .replace(/^kabupaten\s+/, "")
      .replace(/^kota administrasi\s+/, "")
      .replace(/^kota\s+/, "");

  const normalizedSearchLocation =
    normalizeLocation(loc);

  const filtered = jobs.filter(j => {

    const categoryMatch =
      cat === "all" ||
      j.category === cat ||
      j.category_en === cat;

    const searchableText = [
      j.title,
      j.title_en,
      j.company,
      j.category,
      j.category_en,
      j.description,
      j.description_en,
      j.requirements,
      j.requirements_en,
      j.job_type,
      j.job_type_en,
      j.type,
      j.salary,
      j.salary_en,
      j.experience,
      j.experience_en,
      j.education,
      j.education_en,
      j.location
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const keywordMatch =
      !q ||
      searchWords.every(word =>
        searchableText.includes(word)
      );

    const jobLocation =
      normalizeLocation(j.location);

    const locationMatch =
      !loc ||
      jobLocation.includes(normalizedSearchLocation) ||
      (
        normalizedSearchLocation === "indonesia" &&
        (j.location || "").toLowerCase() === "remote"
      );

    return (
      categoryMatch &&
      keywordMatch &&
      locationMatch
    );
  });

hasSearched = true;

// Beri waktu indikator pencarian terlihat
await new Promise(resolve =>
  setTimeout(resolve, 700)
);

await renderJobs(filtered);

// =====================================================
// KEMBALIKAN OPACITY SETELAH HASIL MUNCUL
// =====================================================

if (jobsGridElement) {
  jobsGridElement.style.opacity = "1";
}

document.querySelector("#jobs").scrollIntoView({
  behavior: "smooth"
});

}
document.querySelector("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  hasSearched = true;

  if (jobSuggestions) {
    jobSuggestions.innerHTML = "";
    jobSuggestions.style.display = "none";
  }

  if (citySuggestions) {
    citySuggestions.innerHTML = "";
    citySuggestions.classList.add("hidden");
  }

  filterJobs();
});

categoryFilter.addEventListener("change", filterJobs);

document.querySelectorAll(".quick-tags button").forEach(btn => {
  btn.addEventListener("click", () => {
    keyword.value = btn.dataset.keyword;
    filterJobs();
  });
});

function updateJobSuggestions() {
  if (!keyword || !jobSuggestions) return;

  const query = keyword.value.trim().toLowerCase();
  const language = localStorage.getItem("siteLanguage") || "id";

  const jobCategories = {
    "Administrasi": [
      "Staff Administrasi",
      "Admin Kantor",
      "Admin Operasional",
      "Admin Data",
      "Data Entry",
      "Sekretaris",
      "Personal Assistant",
      "Executive Assistant",
      "Receptionist",
      "Front Office Staff",
      "Office Assistant",
      "Office Manager",
      "Document Controller",
      "Staff Pengarsipan",
      "Staff Administrasi Umum",
      "Admin Penjualan",
      "Admin Pembelian",
      "Admin Gudang",
      "Admin Proyek",
      "Customer Service Admin"
    ],

    "Accounting & Finance": [
      "Staff Akuntansi",
      "Accounting Admin",
      "Junior Accountant",
      "Senior Accountant",
      "Accounting Supervisor",
      "Accounting Manager",
      "Staff Keuangan",
      "Finance Admin",
      "Finance Officer",
      "Finance Supervisor",
      "Finance Manager",
      "Financial Analyst",
      "Payroll Staff",
      "Payroll Officer",
      "Tax Staff",
      "Tax Accountant",
      "Tax Consultant",
      "Auditor Internal",
      "Auditor Eksternal",
      "Credit Analyst"
    ],

    "Marketing & Sales": [
      "Marketing Staff",
      "Marketing Officer",
      "Marketing Executive",
      "Marketing Supervisor",
      "Marketing Manager",
      "Digital Marketing Specialist",
      "Digital Marketing Officer",
      "Social Media Specialist",
      "Social Media Officer",
      "Content Marketing Specialist",
      "SEO Specialist",
      "SEM Specialist",
      "Brand Specialist",
      "Brand Manager",
      "Product Marketing Specialist",
      "Marketing Communication Staff",
      "Public Relations Officer",
      "Sales Staff",
      "Sales Executive",
      "Sales Representative",
      "Sales Supervisor",
      "Sales Manager",
      "Account Executive",
      "Account Manager",
      "Business Development Executive"
    ],

    "Teknologi / IT": [
      "IT Support",
      "IT Staff",
      "IT Administrator",
      "System Administrator",
      "Network Administrator",
      "Network Engineer",
      "Software Engineer",
      "Software Developer",
      "Web Developer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Mobile Developer",
      "Android Developer",
      "iOS Developer",
      "DevOps Engineer",
      "Cloud Engineer",
      "Data Analyst",
      "Data Scientist",
      "Database Administrator",
      "Cyber Security Specialist",
      "Information Security Analyst",
      "QA / Software Tester",
      "UI/UX Designer",
      "IT Project Manager"
    ],

    "Purchasing & Logistik": [
      "Purchasing Staff",
      "Purchasing Officer",
      "Purchasing Supervisor",
      "Purchasing Manager",
      "Procurement Staff",
      "Procurement Officer",
      "Procurement Specialist",
      "Procurement Supervisor",
      "Procurement Manager",
      "Buyer",
      "Strategic Sourcing Specialist",
      "Supply Chain Staff",
      "Supply Chain Analyst",
      "Supply Chain Coordinator",
      "Supply Chain Supervisor",
      "Supply Chain Manager",
      "Logistics Staff",
      "Logistics Coordinator",
      "Logistics Officer",
      "Logistics Supervisor",
      "Logistics Manager",
      "Warehouse Staff",
      "Warehouse Operator",
      "Warehouse Coordinator",
      "Warehouse Supervisor",
      "Warehouse Manager",
      "Inventory Staff",
      "Inventory Control Staff",
      "Inventory Analyst",
      "Inventory Supervisor"
    ],

    "Produksi & Manufaktur": [
      "Production Staff",
      "Production Operator",
      "Production Technician",
      "Production Supervisor",
      "Production Manager",
      "Manufacturing Staff",
      "Manufacturing Engineer",
      "Process Engineer",
      "Industrial Engineer",
      "Maintenance Technician",
      "Maintenance Engineer",
      "Maintenance Supervisor",
      "Quality Control Staff",
      "Quality Control Inspector",
      "Quality Control Analyst",
      "Quality Assurance Staff",
      "Quality Assurance Specialist",
      "Quality Assurance Manager",
      "HSE Staff",
      "HSE Officer",
      "Safety Officer",
      "Safety Supervisor",
      "Health and Safety Manager",
      "Machine Operator",
      "CNC Operator",
      "Production Planner",
      "Production Planner Supervisor",
      "Production Coordinator",
      "Factory Supervisor",
      "Factory Manager"
    ],

    "Human Resources": [
      "Human Resources Staff",
      "HR Administrator",
      "HR Officer",
      "HR Generalist",
      "HR Specialist",
      "HR Supervisor",
      "HR Manager",
      "Recruitment Staff",
      "Recruitment Specialist",
      "Recruitment Consultant",
      "Recruitment Supervisor",
      "Talent Acquisition Specialist",
      "Talent Management Specialist",
      "Training Officer",
      "Learning and Development Specialist",
      "Compensation and Benefits Specialist",
      "Industrial Relations Officer",
      "Employee Relations Officer",
      "HR Business Partner",
      "People Operations Specialist"
    ],

    "Legal & Compliance": [
      "Legal Staff",
      "Legal Officer",
      "Legal Counsel",
      "Corporate Lawyer",
      "Legal Administrator",
      "Compliance Officer",
      "Compliance Specialist",
      "Risk Management Officer",
      "Risk Analyst",
      "Risk Manager",
      "Contract Administrator",
      "Contract Specialist",
      "Company Secretary",
      "Government Relations Officer"
    ],

    "Desain & Kreatif": [
      "Graphic Designer",
      "Visual Designer",
      "Creative Designer",
      "Art Director",
      "Illustrator",
      "Photographer",
      "Videographer",
      "Video Editor",
      "Motion Graphic Designer",
      "Animator",
      "3D Designer",
      "Interior Designer",
      "Fashion Designer",
      "Copywriter",
      "Content Writer",
      "Technical Writer",
      "Editor",
      "Proofreader"
    ],

    "Engineering & Konstruksi": [
      "Architect",
      "Civil Engineer",
      "Mechanical Engineer",
      "Electrical Engineer",
      "Electronics Engineer",
      "Chemical Engineer",
      "Environmental Engineer",
      "Geotechnical Engineer",
      "Structural Engineer",
      "Project Engineer",
      "Site Engineer",
      "Quantity Surveyor",
      "Surveyor",
      "Construction Supervisor",
      "Construction Manager",
      "Site Manager",
      "Project Coordinator"
    ],

    "Pendidikan": [
      "Teacher",
      "Tutor",
      "Private Tutor",
      "Lecturer",
      "Academic Coordinator",
      "School Administrator",
      "School Counselor",
      "Education Consultant",
      "Curriculum Developer",
      "Trainer",
      "Instructor"
    ],

    "Kesehatan": [
      "Nurse",
      "Midwife",
      "Pharmacist",
      "Pharmacy Assistant",
      "Medical Assistant",
      "Medical Secretary",
      "Laboratory Technician",
      "Radiology Technician",
      "Dental Assistant",
      "Physiotherapist",
      "Nutritionist",
      "Psychologist",
      "Caregiver",
      "Home Caregiver",
      "Healthcare Administrator"
    ],

    "Transportasi": [
      "Driver",
      "Personal Driver",
      "Truck Driver",
      "Delivery Driver",
      "Courier",
      "Courier Coordinator",
      "Dispatcher",
      "Fleet Administrator",
      "Fleet Supervisor",
      "Fleet Manager",
      "Motorcycle Courier"
    ],

    "Kuliner & Hospitality": [
      "Waiter",
      "Waitress",
      "Barista",
      "Chef",
      "Cook",
      "Kitchen Staff",
      "Kitchen Supervisor",
      "Restaurant Supervisor",
      "Restaurant Manager",
      "Hotel Staff",
      "Hotel Receptionist",
      "Housekeeping Staff",
      "Housekeeping Supervisor",
      "Event Staff",
      "Event Coordinator",
      "Event Manager"
    ]
  };

  // Belum mengetik → tampilkan kategori
  if (!query) {
    jobSuggestions.innerHTML = `
      <div class="suggestion-header">
        ${language === "en" ? "Job Categories" : "Kategori Pekerjaan"}
      </div>

      ${Object.keys(jobCategories).map(category => `
        <button
          type="button"
          class="job-suggestion-item"
          data-category="${category}"
        >
          <span>${category}</span>
          <span>›</span>
        </button>
      `).join("")}
    `;

    jobSuggestions.classList.remove("hidden");

    jobSuggestions
      .querySelectorAll(".job-suggestion-item")
      .forEach(button => {
        button.addEventListener("click", () => {

          const category = button.dataset.category;
          const categoryJobs = jobCategories[category] || [];

          jobSuggestions.innerHTML = `
            <div class="suggestion-header">
              ${category}
            </div>

            ${categoryJobs.map(title => `
              <button
                type="button"
                class="job-suggestion-item"
                data-job="${title}"
              >
                <span>${title}</span>
              </button>
            `).join("")}
          `;

          jobSuggestions.classList.remove("hidden");

          jobSuggestions
            .querySelectorAll(".job-suggestion-item")
            .forEach(jobButton => {
              jobButton.addEventListener("click", () => {
                keyword.value = jobButton.dataset.job;
                jobSuggestions.classList.add("hidden");
                hasSearched = true;
                filterJobs();
              });
            });
        });
      });

    return;
  }

  // Kalau mengetik manual → cari dari jobTypes
  const allJobTypes = Array.isArray(jobTypes) ? jobTypes : [];

  const matchingTypes = allJobTypes
    .filter(title =>
      title.toLowerCase().includes(query)
    )
    .slice(0, 8);

  if (matchingTypes.length === 0) {
    jobSuggestions.innerHTML = "";
    jobSuggestions.classList.add("hidden");
    return;
  }

  jobSuggestions.innerHTML = `
    <div class="suggestion-header">
      ${language === "en" ? "Job Suggestions" : "Saran Jabatan"}
    </div>

    ${matchingTypes.map(title => `
      <button
        type="button"
        class="job-suggestion-item"
        data-job="${title}"
      >
        <span>${title}</span>
      </button>
    `).join("")}
  `;

  jobSuggestions.classList.remove("hidden");

  jobSuggestions
    .querySelectorAll(".job-suggestion-item")
    .forEach(button => {
      button.addEventListener("click", () => {
        keyword.value = button.dataset.job;
        jobSuggestions.classList.add("hidden");
        hasSearched = true;
        filterJobs();
      });
    });
}

keyword.addEventListener("input", updateJobSuggestions);

keyword.addEventListener("focus", () => {
  updateJobSuggestions();
});

const modal = document.querySelector("#authModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const authForm = document.querySelector("#authForm");

let isRegister = false;
let isCompany = false;

const companyAccountBtn = document.querySelector("#companyAccount");
const jobseekerAccountBtn = document.querySelector("#jobseekerAccount");
const companyFields = document.querySelector("#companyFields");
const jobseekerFields = document.querySelector("#jobseekerFields");

  if (companyAccountBtn) {
  companyAccountBtn.addEventListener("click", () => {

    companyAccountBtn.classList.add("active");
    jobseekerAccountBtn.classList.remove("active");

    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";
    
    // ==================================================
    // MODE MASUK
    // ==================================================

    if (!isRegister) {

      isCompany = true;

      // Tetap tampilkan pilihan jenis akun
      const accountType =
        document.querySelector("#accountType");

      if (accountType) {
        accountType.style.display = "block";
      }

      // Sembunyikan semua field pendaftaran
      if (companyFields) {
        companyFields.style.display = "none";
      }

      if (jobseekerFields) {
        jobseekerFields.style.display = "none";
      }

      const confirmPasswordField =
        document.querySelector("#confirmPasswordField");

      if (confirmPasswordField) {
        confirmPasswordField.style.display = "none";
      }

      // Tetap mode MASUK
      modalTitle.textContent =
        isEnglish
          ? "Log In"
          : "Masuk";

      modalText.textContent =
        isEnglish
          ? "Enter your email and password to log in."
          : "Masukkan email dan password untuk masuk.";

      return;
    }


    // ==================================================
    // MODE DAFTAR
    // ==================================================

    isCompany = true;

    if (companyFields) {
      companyFields.style.display = "block";
    }

    if (jobseekerFields) {
      jobseekerFields.style.display = "none";
    }

    // Konfirmasi password TETAP tampil
    const confirmPasswordField =
      document.querySelector("#confirmPasswordField");

    if (confirmPasswordField) {
      confirmPasswordField.style.display = "block";
    }

    modalTitle.textContent =
      isEnglish
        ? "Register Company"
        : "Daftar Perusahaan";

    modalText.textContent =
      isEnglish
        ? "Create a company account to post job vacancies."
        : "Buat akun perusahaan untuk memasang lowongan.";

  });
}

jobseekerAccountBtn.addEventListener("click", () => {
  
   jobseekerAccountBtn.classList.add("active");
   companyAccountBtn?.classList.remove("active");

  const isEnglish =
    localStorage.getItem("siteLanguage") === "en";

  // ==================================================
  // MODE MASUK
  // ==================================================

  if (!isRegister) {

    isCompany = false;

    // Tetap tampilkan pilihan jenis akun
    const accountType =
      document.querySelector("#accountType");

    if (accountType) {
      accountType.style.display = "block";
    }

    // Sembunyikan field pendaftaran
    if (companyFields) {
      companyFields.style.display = "none";
    }

    if (jobseekerFields) {
      jobseekerFields.style.display = "none";
    }

    const confirmPasswordField =
      document.querySelector("#confirmPasswordField");

    if (confirmPasswordField) {
      confirmPasswordField.style.display = "none";
    }

    // Tetap mode MASUK
    modalTitle.textContent =
      isEnglish
        ? "Log In"
        : "Masuk";

    modalText.textContent =
      isEnglish
        ? "Enter your email and password to log in."
        : "Masukkan email dan password untuk masuk.";

    return;
  }


  // ==================================================
  // MODE DAFTAR
  // ==================================================

  isCompany = false;

  if (companyFields) {
    companyFields.style.display = "none";
  }

  if (jobseekerFields) {
    jobseekerFields.style.display = "block";
  }

  const confirmPasswordField =
    document.querySelector("#confirmPasswordField");

  if (confirmPasswordField) {
    confirmPasswordField.style.display = "block";
  }

  modalTitle.textContent =
    isEnglish
      ? "Register Job Seeker"
      : "Daftar Pencari Kerja";

  modalText.textContent =
    isEnglish
      ? "Create a job seeker account to find and apply for jobs."
      : "Buat akun pencari kerja untuk menemukan dan melamar pekerjaan.";

});
function openModal(title, text){
  modalTitle.textContent = title;
  modalText.textContent = text;

  authForm.classList.toggle(
    "hidden",
    title !== "Masuk" && title !== "Daftar"
  );

  document.querySelector(".switch-auth").classList.toggle(
    "hidden",
    title !== "Masuk" && title !== "Daftar"
  );

  modal.classList.remove("hidden");
}

function showCompanyRegistrationAfterLogin() {
  window.kerjivaCompletingCompanyProfile = true;

  const language =
    localStorage.getItem("siteLanguage") || "id";

  const isEnglish =
    language === "en";

  const notification =
    document.createElement("div");

  notification.id =
    "kerjivaCompanyProfileNotification";

  notification.className =
    "kerjiva-registration-notification";
  notification.style.position = "fixed";
  notification.style.top = "50%";
  notification.style.left = "50%";
  notification.style.transform = "translate(-50%, -50%)";
  notification.style.zIndex = "999999";

  notification.innerHTML = `

    <div class="kerjiva-registration-icon">
      !
    </div>

    <div class="kerjiva-registration-content">

      <div class="kerjiva-registration-title">
        ${
          isEnglish
            ? "Company Profile Not Found"
            : "Profil Perusahaan Belum Ada"
        }
      </div>

      <div class="kerjiva-registration-message">
        ${
          isEnglish
            ? "This account does not have a Company profile yet.<br>Please complete the Company registration form."
            : "Akun ini belum memiliki profil Perusahaan.<br>Silakan lengkapi formulir pendaftaran Perusahaan."
        }
      </div>

    </div>

    <button
      type="button"
      class="kerjiva-registration-ok"
    >
      OK
    </button>

  `;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  const okButton =
    notification.querySelector(
      ".kerjiva-registration-ok"
    );

  okButton.addEventListener("click", () => {

    notification.classList.remove("show");

    setTimeout(() => {

      notification.remove();

      isRegister = true;
      isCompany = true;
      
      const accountType =
       document.querySelector("#accountType");

     if (accountType) {
        accountType.style.display = "none";
        }

      if (companyFields) {
        companyFields.style.display = "block";
      }

      if (jobseekerFields) {
        jobseekerFields.style.display = "none";
      }

      const confirmPasswordField =
        document.querySelector("#confirmPasswordField");

      if (confirmPasswordField) {
        confirmPasswordField.style.display = "block";
      }

      modalTitle.textContent =
        isEnglish
          ? "Register Company"
          : "Daftar Perusahaan";

      modalText.textContent =
        isEnglish
          ? "Create a company account to post job vacancies."
          : "Buat akun perusahaan untuk memasang lowongan.";

      const submitButton =
        authForm?.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {
        submitButton.textContent =
          isEnglish
            ? "Sign Up"
            : "Daftar";
      }

      if (authForm) {
        authForm.classList.remove("hidden");
      }

      const switchAuthContainer =
        document.querySelector(".switch-auth");

      if (switchAuthContainer) {
        switchAuthContainer.classList.remove("hidden");
      }

      if (modal) {
        modal.classList.remove("hidden");
      }

    }, 250);

  });

}
function showJobseekerRegistrationAfterLogin() {

  window.kerjivaCompletingJobseekerProfile = true;

  const language =
    localStorage.getItem("siteLanguage") || "id";

  const isEnglish =
    language === "en";

  const notification =
    document.createElement("div");

  notification.id =
    "kerjivaJobseekerProfileNotification";

  notification.className =
    "kerjiva-registration-notification";

  notification.innerHTML = `

    <div class="kerjiva-registration-icon">
      !
    </div>

    <div class="kerjiva-registration-content">

      <div class="kerjiva-registration-title">
        ${
          isEnglish
            ? "Job Seeker Profile Not Found"
            : "Profil Pencari Kerja Belum Ada"
        }
      </div>

      <div class="kerjiva-registration-message">
        ${
          isEnglish
            ? "This account does not have a Job Seeker profile yet.<br>Please complete the Job Seeker registration form."
            : "Akun ini belum memiliki profil Pencari Kerja.<br>Silakan lengkapi formulir pendaftaran Pencari Kerja."
        }
      </div>

    </div>

    <button
      type="button"
      class="kerjiva-registration-ok"
    >
      OK
    </button>

  `;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  const okButton =
    notification.querySelector(
      ".kerjiva-registration-ok"
    );

  okButton.addEventListener("click", () => {

    notification.classList.remove("show");

    setTimeout(() => {

      notification.remove();

      isRegister = true;
      isCompany = false;

      const accountType =
        document.querySelector("#accountType");

      if (accountType) {
        accountType.style.display = "none";
      }

      if (companyFields) {
        companyFields.style.display = "none";
      }

      if (jobseekerFields) {
        jobseekerFields.style.display = "block";
      }

      const confirmPasswordField =
        document.querySelector("#confirmPasswordField");

      if (confirmPasswordField) {
        confirmPasswordField.style.display = "block";
      }

      modalTitle.textContent =
        isEnglish
          ? "Register Job Seeker"
          : "Daftar Pencari Kerja";

      modalText.textContent =
        isEnglish
          ? "Create a job seeker profile to find and apply for jobs."
          : "Lengkapi profil pencari kerja untuk menemukan dan melamar pekerjaan.";

      const submitButton =
        authForm?.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {
        submitButton.textContent =
          isEnglish
            ? "Sign Up"
            : "Daftar";
      }

      if (authForm) {
        authForm.classList.remove("hidden");
      }

      const switchAuthContainer =
        document.querySelector(".switch-auth");

      if (switchAuthContainer) {
        switchAuthContainer.classList.remove("hidden");
      }

      if (modal) {
        modal.classList.remove("hidden");
      }

    }, 250);

  });

}

async function submitApplication(job){
const accessToken = localStorage.getItem("kerjivaAccessToken");

const userData = localStorage.getItem("kerjivaUser");

  if (!accessToken || !userData) {
   const language =
     localStorage.getItem("siteLanguage") || "id";

     openModal(
      language === "en"
    ? "Login"
    : "Masuk",
  language === "en"
    ? "Please log in first before applying for this job."
    : "Silakan masuk terlebih dahulu sebelum melamar pekerjaan."
);
    authForm.classList.remove("hidden");
    document.querySelector(".switch-auth").classList.remove("hidden");
    return;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
  localStorage.removeItem("kerjivaUser");
  localStorage.removeItem("kerjivaAccessToken");

  const language =
  localStorage.getItem("siteLanguage") || "id";

  openModal(
  language === "en"
    ? "Login"
    : "Masuk",
  language === "en"
    ? "Your login session is invalid. Please log in again."
    : "Sesi login tidak valid. Silakan masuk kembali."
);
    return;
  }

if (!user.id) {
  showNotification("invalidAccount");
  return;
}

// AMBIL DOKUMEN PENCARI KERJA
const documentsResponse = await fetch(
  `${SUPABASE_URL}jobseeker_documents?user_id=eq.${user.id}&select=id,document_type,document_name&order=created_at.desc`,
  {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  }
);

if (!documentsResponse.ok) {
  throw new Error(await documentsResponse.text());
}

const documents = await documentsResponse.json();

console.log("DOKUMEN PELAMAR:", documents);

  try {

// TAMPILKAN PILIHAN DOKUMEN
 const applicationLanguage = localStorage.getItem("siteLanguage") || "id";

if (documents.length > 0) {

  const documentChoices = documents.map(doc => `
    <label style="
      display:flex;
      align-items:center;
      gap:10px;
      padding:12px;
      margin-bottom:8px;
      border:1px solid #e5eaf1;
      border-radius:8px;
      cursor:pointer;
      background:#f8fafc;
    ">
      <input
        type="checkbox"
        value="${doc.id}"
        class="application-document-checkbox"
        style="width:18px;height:18px;"
      >
      <span>
        <strong>${doc.document_name}</strong>
        <br>
        <small style="color:#64748b;">
          ${doc.document_type}
        </small>
      </span>
    </label>
  `).join("");

  const modal = document.createElement("div");

  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:99999;
    padding:20px;
  `;

  modal.innerHTML = `
    <div style="
      background:white;
      width:100%;
      max-width:520px;
      max-height:85vh;
      overflow-y:auto;
      padding:25px;
      border-radius:16px;
      box-shadow:0 10px 40px rgba(0,0,0,.2);
    ">

      <h2 style="
        margin-top:0;
        color:#123b6d;
      ">
        ${
           applicationLanguage === "en"
            ? "Select Documents"
            : "Pilih Dokumen"
        }
      </h2>

      <p style="color:#64748b;">
        ${
         applicationLanguage === "en"
            ? "Select the documents you want to send with this application."
            : "Pilih dokumen yang ingin kamu kirim bersama lamaran ini."
        }
      </p>

      <div>
        ${documentChoices}
      </div>

      <div style="
        display:flex;
        gap:10px;
        margin-top:20px;
      ">

        <button
          type="button"
          id="cancelApplicationBtn"
          style="
            flex:1;
            padding:12px;
            border:none;
            border-radius:8px;
            background:#e5e7eb;
            color:#172b4d;
            cursor:pointer;
            font-weight:bold;
          "
        >
          ${
          applicationLanguage === "en"
              ? "Cancel"
              : "Batal"
          }
        </button>

        <button
          type="button"
          id="continueApplicationBtn"
          style="
            flex:1;
            padding:12px;
            border:none;
            border-radius:8px;
            background:#123b6d;
            color:white;
            cursor:pointer;
            font-weight:bold;
          "
        >
          ${
          applicationLanguage === "en"
              ? "Continue"
              : "Lanjutkan"
          }
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById("cancelApplicationBtn")
    .addEventListener("click", () => {
      modal.remove();
    });

  document
    .getElementById("continueApplicationBtn")
    .addEventListener("click", () => {

      const selectedDocuments = [
        ...document.querySelectorAll(
          ".application-document-checkbox:checked"
        )
      ].map(input => input.value);

      console.log(
        "DOKUMEN YANG DIPILIH:",
        selectedDocuments
      );

      modal.remove();

      // Sementara lanjut ke proses lamaran lama
      submitApplicationWithDocuments(
        job,
        user,
        accessToken,
        selectedDocuments
      );

    });

  return;
}
    const response = await fetch(SUPABASE_APPLICATIONS_URL, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        job_id: job.id,
        user_id: user.id,
        status: "submitted"
      })
    });

   if (!response.ok) {
  const data = await response.json().catch(() => ({}));

  const errorText = JSON.stringify(data).toLowerCase();

  if (
    response.status === 409 ||
    errorText.includes("duplicate") ||
    errorText.includes("already exists") ||
    errorText.includes("unique constraint")
  ) {
   const language = localStorage.getItem("siteLanguage") || "id";

alert(
 applicationLanguage === "en"
    ? "You have already applied for this job."
    : "Anda sudah melamar lowongan ini."
);
return;
  }

  throw new Error(
    data.message ||
    data.error_description ||
    data.msg ||
    "Lamaran gagal dikirim"
  );
}

   const language = localStorage.getItem("siteLanguage") || "id";

showNotification(
  "applicationSuccess",
  `\n\n${job.title} - ${job.company}`
);
  } catch (error) {
  showNotification("applicationFailed", " " + error.message);
  }
}
async function submitApplicationWithDocuments(
  job,
  user,
  accessToken,
  selectedDocuments
) {

  try {

    // SIMPAN LAMARAN
    const response = await fetch(SUPABASE_APPLICATIONS_URL, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        job_id: job.id,
        user_id: user.id,
        status: "submitted"
      })
    });

    if (!response.ok) {

      const data = await response.json().catch(() => ({}));
      const errorText = JSON.stringify(data).toLowerCase();

      if (
        response.status === 409 ||
        errorText.includes("duplicate") ||
        errorText.includes("already exists") ||
        errorText.includes("unique constraint")
      ) {
        const language =
          localStorage.getItem("siteLanguage") || "id";

        alert(
          language === "en"
            ? "You have already applied for this job."
            : "Anda sudah melamar lowongan ini."
        );

        return;
      }

      throw new Error(
        data.message ||
        data.error_description ||
        data.msg ||
        "Lamaran gagal dikirim"
      );
    }

    const applicationData = await response.json();

    const application = Array.isArray(applicationData)
      ? applicationData[0]
      : applicationData;

    if (!application || !application.id) {
      throw new Error("Application ID tidak ditemukan.");
    }

    console.log(
      "APPLICATION ID:",
      application.id
    );

    // SIMPAN DOKUMEN YANG DIPILIH
    for (const documentId of selectedDocuments) {

      const documentResponse = await fetch(
        `${SUPABASE_URL}application_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            application_id: application.id,
            document_id: documentId
          })
        }
      );

      if (!documentResponse.ok) {
        throw new Error(
          await documentResponse.text()
        );
      }
    }

    console.log(
      "DOKUMEN LAMARAN TERSIMPAN:",
      selectedDocuments
    );

    const language =
      localStorage.getItem("siteLanguage") || "id";

    showNotification(
      "applicationSuccess",
      `\n\n${job.title} - ${job.company}`
    );

  } catch (error) {

    console.error(
      "Gagal mengirim lamaran:",
      error
    );

    showNotification(
      "applicationFailed",
      " " + error.message
    );
  }
}


// =====================================================
// HANDLER DETAIL LOWONGAN
// Membaca terjemahan langsung dari database
// Tidak memanggil Gemini
// =====================================================

function openJobDetails(idx) {

  if (!Number.isInteger(idx)) return;

  const originalJob = jobs[idx];

  if (!originalJob) return;

  const language =
    localStorage.getItem("siteLanguage") || "id";

  // =====================================================
  // PILIH DATA SESUAI BAHASA
  // EN = gunakan hasil terjemahan yang sudah tersimpan
  // ID = gunakan data asli
  // =====================================================

  const job =
    language === "en"
      ? {
          ...originalJob,

          title:
            originalJob.title_en ||
            originalJob.title ||
            "",

          description:
            originalJob.description_en ||
            originalJob.description ||
            "",

          requirements:
            originalJob.requirements_en ||
            originalJob.requirements ||
            originalJob.requirement ||
            "",

          type:
            originalJob.job_type_en ||
            originalJob.type ||
            originalJob.job_type ||
            "",

          category:
            originalJob.category_en ||
            originalJob.category ||
            "",

          salary:
            originalJob.salary_en ||
            originalJob.salary ||
            "",

          experience:
            originalJob.experience_en ||
            originalJob.experience ||
            "",

          education:
            originalJob.education_en ||
            originalJob.education ||
            ""
        }
      : originalJob;


  // =====================================================
  // ISI JOB DETAILS
  // =====================================================

  document.getElementById("jobDetailTitle").textContent =
    job.title || "";

  document.getElementById("jobDetailCompany").textContent =
    job.company || "";

  document.getElementById("jobDetailLocation").textContent =
    `📍 ${job.location || ""}`;

  document.getElementById("jobDetailType").textContent =
    `💼 ${job.type || ""}`;

  document.getElementById("jobDetailSalary").textContent =
    `💰 ${
      job.salary ||
      (
        language === "en"
          ? "Salary according to company policy"
          : "Gaji sesuai ketentuan perusahaan"
      )
    }`;

  document.getElementById("jobDetailDescription").textContent =
    job.description ||
    (
      language === "en"
        ? "Job description is not available."
        : "Deskripsi pekerjaan belum tersedia."
    );

  document.getElementById("jobDetailRequirements").textContent =
    job.requirements ||
    (
      language === "en"
        ? "Requirements are not available."
        : "Persyaratan belum tersedia."
    );


  // =====================================================
  // TOMBOL LAMAR
  // Tetap menggunakan DATA ASLI
  // =====================================================

  document.getElementById("jobDetailApply").onclick = () => {

    submitApplication(originalJob);

    document
      .getElementById("jobDetailModal")
      .classList.add("hidden");

  };


  // =====================================================
  // TAMPILKAN MODAL
  // =====================================================

  document
    .getElementById("jobDetailModal")
    .classList.remove("hidden");
}


// =====================================================
// KLIK DARI DAFTAR LOWONGAN
// =====================================================

jobsGrid.addEventListener("click", e => {

  const details =
    e.target.closest("[data-details]");

  const apply =
    e.target.closest("[data-apply]");

  if (!details && !apply) return;

  const idx = Number(
    (details || apply).dataset[
      details ? "details" : "apply"
    ]
  );

  if (!Number.isInteger(idx)) return;


  // Jika tombol Lamar langsung
  if (apply) {

    const originalJob = jobs[idx];

    if (originalJob) {
      submitApplication(originalJob);
    }

    return;
  }


  // Jika tombol View Details
  openJobDetails(idx);

});


// =====================================================
// KLIK DARI KARTU BIRU
// =====================================================

const featuredJobElement =
  document.querySelector("#featuredJob");

if (featuredJobElement) {

  featuredJobElement.addEventListener("click", e => {

    const details =
      e.target.closest("[data-details]");

    const apply =
      e.target.closest("[data-apply]");

    if (!details && !apply) return;

    const idx = Number(
      (details || apply).dataset[
        details ? "details" : "apply"
      ]
    );

    if (!Number.isInteger(idx)) return;


    // Jika tombol Lamar langsung
    if (apply) {

      const originalJob = jobs[idx];

      if (originalJob) {
        submitApplication(originalJob);
      }

      return;
    }


    // Jika tombol View Details
    openJobDetails(idx);

  });

}
const loginBtn = document.querySelector("#loginBtn");
const registerBtn = document.querySelector("#registerBtn");
const menuJobseeker = document.querySelector("#menuJobseeker");
const menuCompany = document.querySelector("#menuCompany");
const menuCompanies = document.querySelector("#menuCompanies");
const menuHelp = document.querySelector("#menuHelp");
const menuPayment = document.querySelector("#menuPayment");
const menuSettings = document.querySelector("#menuSettings");
const menuLogout = document.querySelector("#menuLogout");
const menuHome = document.querySelector("#menuHome");

const menuJobs = document.querySelector("#menuJobs");
const menuHow = document.querySelector("#menuHow");
const menuAbout = document.querySelector("#menuAbout");
const menuContact = document.querySelector("#menuContact");

if (menuJobs) {
  menuJobs.onclick = function () {
    window.location.href = "index.html#jobs";
  };
}

if (menuHow) {
  menuHow.onclick = function () {
    window.location.href = "index.html#how";
  };
}

if (menuAbout) {
  menuAbout.onclick = function () {
    window.location.href = "tentang.html";
  };
}

if (menuContact) {
  menuContact.onclick = function () {
    window.location.href = "kontak.html";
  };
}



if (menuCompanies) {
  menuCompanies.onclick = function () {
    window.location.href = "perusahaan.html";
  };
}
if (menuPayment) {
  menuPayment.onclick = function () {
    window.location.href = "pembayaran.html";
  };
}
if (menuSettings) {
  menuSettings.onclick = function () {
    window.location.href = "settings.html";
  };
}

if (menuHome) {
  menuHome.onclick = function () {
    window.location.href = "index.html";
  };
}
if (menuJobseeker) {
  menuJobseeker.onclick = function () {
    const userData =
      localStorage.getItem("kerjivaUser");

    const activeRole =
      localStorage.getItem("kerjivaActiveRole");

    // BELUM LOGIN
    if (!userData || !activeRole) {
      isRegister = false;
      isCompany = false;

      const authModal =
        document.getElementById("authModal");

      const modalTitle =
        document.getElementById("modalTitle");

      const modalText =
        document.getElementById("modalText");

      const authForm =
        document.getElementById("authForm");

      if (authModal) {
        authModal.classList.remove("hidden");
      }

      if (modalTitle) {
        modalTitle.textContent =
          localStorage.getItem("siteLanguage") === "en"
            ? "Log in"
            : "Masuk";
      }

      if (modalText) {
        modalText.textContent =
          localStorage.getItem("siteLanguage") === "en"
            ? "Log in to your account"
            : "Masuk ke akun Anda";
      }

      if (authForm) {
        authForm.dataset.mode = "login";
      }

      return;
    }

    // SUDAH LOGIN SEBAGAI PENCAri KERJA
    if (activeRole === "jobseeker") {
      if (typeof showJobseekerDashboard === "function") {
        showJobseekerDashboard();
      }

      return;
    }

    // LOGIN SEBAGAI PERUSAHAAN
    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";

    alert(
      isEnglish
        ? "Please log out first, then log in as a Job Seeker."
        : "Silakan logout terlebih dahulu, lalu login sebagai Pencari Kerja."
    );
  };
}

if (menuCompany) {
  menuCompany.onclick = function () {
    const userData =
      localStorage.getItem("kerjivaUser");

    const activeRole =
      localStorage.getItem("kerjivaActiveRole");

    // BELUM LOGIN
    if (!userData || !activeRole) {
      isRegister = false;
      isCompany = true;

      const authModal =
        document.getElementById("authModal");

      const modalTitle =
        document.getElementById("modalTitle");

      const modalText =
        document.getElementById("modalText");

      const authForm =
        document.getElementById("authForm");

      if (authModal) {
        authModal.classList.remove("hidden");
      }

      if (modalTitle) {
        modalTitle.textContent =
          localStorage.getItem("siteLanguage") === "en"
            ? "Log in"
            : "Masuk";
      }

      if (modalText) {
        modalText.textContent =
          localStorage.getItem("siteLanguage") === "en"
            ? "Log in to your account"
            : "Masuk ke akun Anda";
      }

      if (authForm) {
        authForm.dataset.mode = "login";
      }

      return;
    }

    // SUDAH LOGIN SEBAGAI PERUSAHAAN
    if (activeRole === "company") {
      if (typeof showCompanyDashboard === "function") {
        showCompanyDashboard();
      }

      return;
    }

    // LOGIN SEBAGAI PENCAri KERJA
    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";

    alert(
      isEnglish
        ? "Please log out first, then log in as a Company."
        : "Silakan logout terlebih dahulu, lalu login sebagai Perusahaan."
    );
  };
}

if (menuHelp) {
  menuHelp.addEventListener("click", () => {
    window.location.href = "bantuan.html";
  });
}

// ==================================================
// EFEK LOGOUT KERJIVA
// ==================================================
function showLogoutEffect() {

  const overlay = document.createElement("div");

  overlay.id = "kerjivaLogoutEffect";

  overlay.innerHTML = `
    <div class="kerjiva-logout-box">
      <div class="kerjiva-logout-logo">
        <img src="kerjiva.png" alt="Kerjiva">
      </div>

      <div class="kerjiva-logout-text">
        Keluar dari akun...
      </div>
    </div>
  `;

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.35);
    backdrop-filter: blur(2px);
    opacity: 0;
    transition: opacity 0.25s ease;
  `;

  const box = overlay.querySelector(".kerjiva-logout-box");

  box.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 18px;
    border-radius: 14px;
    background: rgba(255,255,255,0.92);
    box-shadow: 0 8px 30px rgba(0,0,0,0.10);
  `;

  const logo = overlay.querySelector(".kerjiva-logout-logo");

  logo.style.cssText = `
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    animation: kerjivaLogoutSpin 1s linear infinite;
  `;

  const img = logo.querySelector("img");

  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  `;

  const text = overlay.querySelector(".kerjiva-logout-text");

  text.style.cssText = `
    font-size: 12px;
    font-weight: 500;
    opacity: 0.75;
  `;

  if (!document.getElementById("kerjivaLogoutAnimation")) {

    const style = document.createElement("style");

    style.id = "kerjivaLogoutAnimation";

    style.textContent = `
      @keyframes kerjivaLogoutSpin {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }
    `;

    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  return overlay;
}

if (menuLogout) {
  menuLogout.addEventListener("click", async () => {
    const logoutEffect = showLogoutEffect();
    try {

      // ==================================================
      // LOGOUT MENU UTAMA
      // BENAR-BENAR AKHIRI SESSION SUPABASE
      // ==================================================
      if (
        typeof supabaseAuth !== "undefined" &&
        supabaseAuth.auth
      ) {
        const { error } =
          await supabaseAuth.auth.signOut();

        if (error) {
          console.error(
            "Logout Supabase error:",
            error
          );
        }
      }

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    // ==================================================
    // HAPUS SESSION KERJIVA
    // ==================================================
    localStorage.removeItem("kerjivaUser");
    localStorage.removeItem("kerjivaAccessToken");
    localStorage.removeItem("kerjivaActiveRole");

    // ==================================================
    // KEMBALI KE HALAMAN UTAMA
    // ==================================================
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {

    // ==================================================
    // CEK SESSION AKTIF
    // ==================================================

    const userData =
      localStorage.getItem("kerjivaUser");

    const accessToken =
      localStorage.getItem("kerjivaAccessToken");

    const activeRole =
      localStorage.getItem("kerjivaActiveRole");

    if (userData && accessToken && activeRole) {

      const isEnglish =
        localStorage.getItem("siteLanguage") === "en";

      alert(
        isEnglish
          ? "You are already logged in."
          : "Anda masih dalam keadaan login."
      );

      return;
    }

    isRegister = false;
    isCompany = false;

    if (modalTitle) {
      modalTitle.textContent =
        localStorage.getItem("siteLanguage") === "en"
          ? "Log In"
          : "Masuk";
    }

    if (modalText) {
      modalText.textContent =
        localStorage.getItem("siteLanguage") === "en"
          ? "Enter your email and password to log in."
          : "Masukkan email dan password untuk masuk.";
    }

    // ================= SEMBUNYIKAN FIELD PENDAFTARAN =================

  const accountType = document.querySelector("#accountType");

if (accountType) {
  accountType.style.display = "block";
}

const accountTypeLabel =
  document.querySelector("#accountTypeLabel");

if (accountTypeLabel) {
  accountTypeLabel.textContent =
    localStorage.getItem("siteLanguage") === "en"
      ? "Log in as:"
      : "Masuk sebagai:";
}

const jobseekerFields =
  document.querySelector("#jobseekerFields");

if (jobseekerFields) {
  jobseekerFields.style.display = "none";
}
  
    const companyFields =
      document.querySelector("#companyFields");

    if (companyFields) {
      companyFields.style.display = "none";
    }

    const confirmPasswordField =
      document.querySelector("#confirmPasswordField");

    if (confirmPasswordField) {
      confirmPasswordField.style.display = "none";
    }

    // ================= TOMBOL =================

    const submitButton =
      authForm?.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.textContent =
        localStorage.getItem("siteLanguage") === "en"
          ? "Log In"
          : "Masuk";
    }

    const switchAuth =
      document.querySelector("#switchAuth");

    if (switchAuth) {
      switchAuth.textContent =
        localStorage.getItem("siteLanguage") === "en"
          ? "Sign Up"
          : "Daftar";
    }

    // ================= TAMPILKAN FORM =================

    if (authForm) {
      authForm.classList.remove("hidden");
    }

    const switchAuthContainer =
      document.querySelector(".switch-auth");

    if (switchAuthContainer) {
      switchAuthContainer.classList.remove("hidden");
    }
  

    // ================= LUPA PASSWORD =================

const forgotPasswordWrapper =
  document.querySelector("#forgotPasswordWrapper");

if (forgotPasswordWrapper) {
  forgotPasswordWrapper.style.display = "block";
}
     if (modal) {
      modal.classList.remove("hidden");
    }
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", () => {

    const userData =
      localStorage.getItem("kerjivaUser");

    const accessToken =
      localStorage.getItem("kerjivaAccessToken");

    const activeRole =
      localStorage.getItem("kerjivaActiveRole");

    if (userData && accessToken && activeRole) {

      const isEnglish =
        localStorage.getItem("siteLanguage") === "en";

      alert(
        isEnglish
          ? "You are already logged in."
          : "Anda masih dalam keadaan login."
      );

      return;
    }

    isRegister = true;
    isCompany = false;

    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";

    // ================= JUDUL =================

    if (modalTitle) {
      modalTitle.textContent = isEnglish
        ? "Sign Up"
        : "Daftar";
    }

    if (modalText) {
      modalText.textContent = isEnglish
        ? "Create an account to start applying for jobs."
        : "Buat akun untuk mulai melamar pekerjaan.";
    }

    // ================= PILIHAN JENIS AKUN =================

    const accountType =
      document.querySelector("#accountType");

    if (accountType) {
      accountType.style.display = "block";
    }

    // ================= FIELD PENCARI KERJA =================

    const jobseekerFields =
      document.querySelector("#jobseekerFields");

    if (jobseekerFields) {
       jobseekerFields.style.display = "none";
      }

    // ================= FIELD PERUSAHAAN =================

    const companyFields =
      document.querySelector("#companyFields");

    if (companyFields) {
      companyFields.style.display = "none";
    }

    // ================= KONFIRMASI PASSWORD =================

    const confirmPasswordField =
      document.querySelector("#confirmPasswordField");

    if (confirmPasswordField) {
       confirmPasswordField.style.display = "none";
    }

// ================= TOMBOL =================

const submitButton =
  authForm?.querySelector('button[type="submit"]');

if (submitButton) {
  submitButton.textContent = isEnglish
    ? "Sign Up"
    : "Daftar";
}

const switchAuth =
  document.querySelector("#switchAuth");

if (switchAuth) {
  switchAuth.textContent = isEnglish
    ? "Log In"
    : "Masuk";
}

updateForgotPasswordText();

// ================= SEMBUNYIKAN LUPA PASSWORD =================

const forgotPasswordWrapper =
  document.querySelector("#forgotPasswordWrapper");

if (forgotPasswordWrapper) {
  forgotPasswordWrapper.style.display = "none";
}

// ================= TAMPILKAN FORM =================

if (authForm) {
  authForm.classList.remove("hidden");
}

const switchAuthContainer =
  document.querySelector(".switch-auth");

if (switchAuthContainer) {
  switchAuthContainer.classList.remove("hidden");
}

if (modal) {
  modal.classList.remove("hidden");
}

// ================= TEKS LUPA PASSWORD =================

function updateForgotPasswordText() {
  const forgotPasswordText =
    document.querySelector("#forgotPasswordText");

  if (!forgotPasswordText) return;

  const isEnglish =
    localStorage.getItem("siteLanguage") === "en";

  forgotPasswordText.textContent =
    isEnglish
      ? "Forgot Password?"
      : "Lupa Password?";
}

    updateForgotPasswordText();

// ================= LUPA PASSWORD =================

const forgotPasswordBtn =
  document.querySelector("#forgotPasswordBtn");

const forgotPasswordForm =
  document.querySelector("#forgotPasswordForm");

const forgotConfirmPasswordField =
  document.querySelector("#confirmPasswordField");

if (forgotPasswordBtn && forgotPasswordForm) {

  forgotPasswordBtn.addEventListener("click", () => {

    const forgotAccountType =
      document.querySelector("#accountType");

    const forgotJobseekerFields =
      document.querySelector("#jobseekerFields");

    const forgotCompanyFields =
      document.querySelector("#companyFields");

    const forgotSwitchAuth =
      document.querySelector("#switchAuth");

    if (forgotAccountType) {
      forgotAccountType.style.display = "none";
    }

    if (forgotJobseekerFields) {
      forgotJobseekerFields.style.display = "none";
    }

    if (forgotCompanyFields) {
      forgotCompanyFields.style.display = "none";
    }

    if (forgotConfirmPasswordField) {
      forgotConfirmPasswordField.style.display = "none";
    }

    if (forgotSwitchAuth) {
      forgotSwitchAuth.parentElement.style.display = "none";
    }

    const forgotSubmitButton =
      authForm?.querySelector('button[type="submit"]');

    if (forgotSubmitButton) {
      forgotSubmitButton.style.display = "none";
    }

    forgotPasswordForm.style.display = "block";

    const loginEmail =
      document.querySelector("#email");

    const forgotEmail =
      document.querySelector("#forgotPasswordEmail");

    if (
      loginEmail &&
      forgotEmail &&
      loginEmail.value.trim()
    ) {
      forgotEmail.value =
        loginEmail.value.trim();
    }

  });

}

// ================= MODE DAFTAR =================

if (isRegister) {

  isCompany = false;

  modalTitle.textContent = isEnglish
    ? "Sign Up"
    : "Daftar";

  modalText.textContent = isEnglish
    ? "Create an account to start applying for jobs."
    : "Buat akun untuk mulai melamar pekerjaan.";

  const registerAccountType =
    document.querySelector("#accountType");

  if (registerAccountType) {
    registerAccountType.style.display = "block";
  }

  const registerJobseekerFields =
    document.querySelector("#jobseekerFields");

  if (registerJobseekerFields) {
    registerJobseekerFields.style.display = "none";
  }

  const registerCompanyFields =
    document.querySelector("#companyFields");

  if (registerCompanyFields) {
    registerCompanyFields.style.display = "none";
  }

  const registerConfirmPasswordField =
    document.querySelector("#confirmPasswordField");

  if (registerConfirmPasswordField) {
    registerConfirmPasswordField.style.display = "none";
  }

  const registerSubmitButton =
    authForm?.querySelector('button[type="submit"]');

  if (registerSubmitButton) {
    registerSubmitButton.textContent = isEnglish
      ? "Sign Up"
      : "Daftar";
    registerSubmitButton.style.display = "";
  }

  const registerSwitchAuth =
    document.querySelector("#switchAuth");

  if (registerSwitchAuth) {
    registerSwitchAuth.textContent =
      isEnglish
        ? "Log In"
        : "Masuk";

    registerSwitchAuth.parentElement.style.display = "";
  }

}

// ================= MODE MASUK =================

if (!isRegister) {

  isCompany = false;

  modalTitle.textContent = isEnglish
    ? "Log In"
    : "Masuk";

  modalText.textContent = isEnglish
    ? "Enter your email and password to log in."
    : "Masukkan email dan password untuk masuk.";

  const loginAccountType =
    document.querySelector("#accountType");

  if (loginAccountType) {
    loginAccountType.style.display = "none";
  }

  const loginJobseekerFields =
    document.querySelector("#jobseekerFields");

  if (loginJobseekerFields) {
    loginJobseekerFields.style.display = "none";
  }

  const loginCompanyFields =
    document.querySelector("#companyFields");

  if (loginCompanyFields) {
    loginCompanyFields.style.display = "none";
  }

  const loginConfirmPasswordField =
    document.querySelector("#confirmPasswordField");

  if (loginConfirmPasswordField) {
    loginConfirmPasswordField.style.display = "none";
  }

  const loginSubmitButton =
    authForm?.querySelector('button[type="submit"]');

  if (loginSubmitButton) {
    loginSubmitButton.textContent = isEnglish
      ? "Log In"
      : "Masuk";

    loginSubmitButton.style.display = "";
  }

  const loginSwitchAuth =
    document.querySelector("#switchAuth");

  if (loginSwitchAuth) {
    loginSwitchAuth.textContent =
      isEnglish
        ? "Sign Up"
        : "Daftar";

    loginSwitchAuth.parentElement.style.display = "";
  }

  if (forgotPasswordWrapper) {
    forgotPasswordWrapper.style.display = "block";
  }

}
    });
  // ================= SWITCH MASUK / DAFTAR =================

const switchAuthButton =
  document.querySelector("#switchAuth");

if (switchAuthButton) {

  switchAuthButton.addEventListener("click", () => {

    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";

    // ================= KE MODE DAFTAR =================

    if (!isRegister) {

      isRegister = true;
      isCompany = false;

      if (modalTitle) {
        modalTitle.textContent =
          isEnglish ? "Sign Up" : "Daftar";
      }

      if (modalText) {
        modalText.textContent =
          isEnglish
            ? "Create an account to start applying for jobs."
            : "Buat akun untuk mulai melamar pekerjaan.";
      }

      const accountType =
        document.querySelector("#accountType");

      if (accountType) {
        accountType.style.display = "block";
      }

      const jobseekerFields =
        document.querySelector("#jobseekerFields");

      if (jobseekerFields) {
        jobseekerFields.style.display = "none";
      }

      const companyFields =
        document.querySelector("#companyFields");

      if (companyFields) {
        companyFields.style.display = "none";
      }

      const confirmPasswordField =
        document.querySelector("#confirmPasswordField");

      if (confirmPasswordField) {
        confirmPasswordField.style.display = "none";
      }

      const submitButton =
        authForm?.querySelector('button[type="submit"]');

      if (submitButton) {
        submitButton.textContent =
          isEnglish ? "Sign Up" : "Daftar";
      }

      switchAuthButton.textContent =
        isEnglish ? "Log In" : "Masuk";

      if (forgotPasswordWrapper) {
        forgotPasswordWrapper.style.display = "none";
      }

      return;
    }

    // ================= KE MODE MASUK =================

    isRegister = false;
    isCompany = false;

    if (modalTitle) {
      modalTitle.textContent =
        isEnglish ? "Log In" : "Masuk";
    }

    if (modalText) {
      modalText.textContent =
        isEnglish
          ? "Enter your email and password to log in."
          : "Masukkan email dan password untuk masuk.";
    }

    const accountType =
      document.querySelector("#accountType");

    if (accountType) {
      accountType.style.display = "none";
    }

    const jobseekerFields =
      document.querySelector("#jobseekerFields");

    if (jobseekerFields) {
      jobseekerFields.style.display = "none";
    }

    const companyFields =
      document.querySelector("#companyFields");

    if (companyFields) {
      companyFields.style.display = "none";
    }

    const confirmPasswordField =
      document.querySelector("#confirmPasswordField");

    if (confirmPasswordField) {
      confirmPasswordField.style.display = "none";
    }

    const submitButton =
      authForm?.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.textContent =
        isEnglish ? "Log In" : "Masuk";
    }

    switchAuthButton.textContent =
      isEnglish ? "Sign Up" : "Daftar";

    if (forgotPasswordWrapper) {
      forgotPasswordWrapper.style.display = "block";
    }

  });

}
document.querySelector("#closeJobDetail").addEventListener("click", () => {
  document.querySelector("#jobDetailModal").classList.add("hidden");
});

document.querySelector("#jobDetailModal").addEventListener("click", e => {
  const jobDetailModal = document.querySelector("#jobDetailModal");

  if (e.target === jobDetailModal) {
    jobDetailModal.classList.add("hidden");
  }
});
  document.querySelector("#jobDetailModal").addEventListener("click", e => {
  const jobDetailModal = document.querySelector("#jobDetailModal");

  if (e.target === jobDetailModal) {
    jobDetailModal.classList.add("hidden");
  }
});


// ================= AKTIFKAN TOMBOL LUPA PASSWORD =================

const forgotBtn =
  document.querySelector("#forgotPasswordBtn");

const forgotForm =
  document.querySelector("#forgotPasswordForm");

if (forgotBtn && forgotForm) {

  forgotBtn.addEventListener("click", () => {

    document.querySelector("#accountType")?.style.setProperty(
      "display",
      "none"
    );

    document.querySelector("#jobseekerFields")?.style.setProperty(
      "display",
      "none"
    );

    document.querySelector("#companyFields")?.style.setProperty(
      "display",
      "none"
    );

    document.querySelector("#confirmPasswordField")?.style.setProperty(
      "display",
      "none"
    );

    document.querySelector("#switchAuth")?.parentElement?.style.setProperty(
      "display",
      "none"
    );

    const mainSubmit =
      authForm?.querySelector('button[type="submit"]');

    if (mainSubmit) {
      mainSubmit.style.display = "none";
    }

    forgotForm.style.display = "block";

    const loginEmail =
      document.querySelector("#email");

    const forgotEmail =
      document.querySelector("#forgotPasswordEmail");

    if (
      loginEmail &&
      forgotEmail &&
      loginEmail.value.trim()
    ) {
      forgotEmail.value =
        loginEmail.value.trim();
    }

  });

}
  // ================= KIRIM LINK RESET PASSWORD =================

const sendResetPasswordBtn =
  document.querySelector("#sendResetPasswordBtn");

if (sendResetPasswordBtn) {

  sendResetPasswordBtn.addEventListener("click", async () => {

    const forgotEmail =
      document.querySelector("#forgotPasswordEmail");

    const email =
      forgotEmail?.value.trim();

    if (!email) {
      alert(
        localStorage.getItem("siteLanguage") === "en"
          ? "Please enter your email address."
          : "Silakan masukkan alamat email."
      );
      return;
    }

    sendResetPasswordBtn.disabled = true;

    const originalText =
      sendResetPasswordBtn.textContent;

    sendResetPasswordBtn.textContent =
      localStorage.getItem("siteLanguage") === "en"
        ? "Sending..."
        : "Mengirim...";

    try {

      const { error } =
        await supabaseAuth.auth.resetPasswordForEmail(
          email,
          {
          redirectTo: "https://kerjiva.com/?reset=password"
          }
        );

      if (error) {
        console.error("RESET PASSWORD ERROR:", error);

        alert(
          localStorage.getItem("siteLanguage") === "en"
            ? "Failed to send reset link: " + error.message
            : "Gagal mengirim link reset password: " + error.message
        );

        return;
      }

      alert(
        localStorage.getItem("siteLanguage") === "en"
          ? "Reset password link has been sent to your email."
          : "Link reset password sudah dikirim ke email Anda."
      );

    } catch (error) {

      console.error("RESET PASSWORD ERROR:", error);

      alert(
        localStorage.getItem("siteLanguage") === "en"
          ? "An error occurred while sending the reset link."
          : "Terjadi kesalahan saat mengirim link reset password."
      );

    } finally {

      sendResetPasswordBtn.disabled = false;

      sendResetPasswordBtn.textContent =
        originalText;

    }

  });

}


authForm.addEventListener("submit", async e => {
  e.preventDefault();

  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector("#password");
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // ================= DATA PENCARI KERJA =================
  const firstName =
    document.querySelector("#firstName")?.value.trim() || "";

  const lastName =
    document.querySelector("#lastName")?.value.trim() || "";

  const jobseekerPhone =
    document.querySelector("#jobseekerPhone")?.value.trim() || "";

  const jobseekerCity =
    document.querySelector("#jobseekerCity")?.value.trim() || "";

  const confirmPassword =
    document.querySelector("#confirmPassword")?.value || "";

  // ================= DATA PERUSAHAAN =================
  const companyName =
    document.querySelector("#companyName")?.value.trim() || "";

  const companyPhone =
    document.querySelector("#companyPhone")?.value.trim() || "";

  const companyWebsite =
    document.querySelector("#companyWebsite")?.value.trim() || "";

  const companyCity =
    document.querySelector("#companyCity")?.value.trim() || "";

  const companyAddress =
    document.querySelector("#companyAddress")?.value.trim() || "";

const authUrl = SUPABASE_URL.replace(
  "/rest/v1/",
  "/auth/v1/"
   );

  try {

    // ==================================================
    // VALIDASI SAAT DAFTAR
    // ==================================================

    if (isRegister) {

      // Harus memilih jenis akun
      if (
        document.querySelector("#accountType") &&
        !isCompany &&
        !document.querySelector("#jobseekerFields")?.style.display
          .includes("block")
      ) {
        showNotification(
          "invalidAccount",
          " Silakan pilih jenis akun terlebih dahulu."
        );
        return;
      }

      // ---------------- PENCARI KERJA ----------------

      if (!isCompany) {

      if (!firstName || !lastName) {
  showNotification(
    "invalidAccount",
    localStorage.getItem("siteLanguage") === "en"
      ? " First Name and Last Name are required."
      : " Nama depan dan nama belakang wajib diisi."
  );
  return;
}

if (!jobseekerPhone) {
  showNotification(
    "invalidAccount",
    localStorage.getItem("siteLanguage") === "en"
      ? " Phone number is required."
      : " Nomor telepon wajib diisi."
  );
  return;
}

if (!jobseekerCity) {
  showNotification(
    "invalidAccount",
    localStorage.getItem("siteLanguage") === "en"
      ? " City is required."
      : " Kota wajib diisi."
  );
  return;
}
      }

      // ---------------- PASSWORD ----------------

     if (password !== confirmPassword) {
        showNotification(
       "invalidAccount",
         localStorage.getItem("siteLanguage") === "en"
         ? " Password confirmation does not match."
      : " Konfirmasi password tidak sama."
       );
   return;
}
    }
    // ==================================================
// LENGKAPI PROFIL PERUSAHAAN DARI AKUN YANG SUDAH LOGIN
// ==================================================

if (window.kerjivaCompletingCompanyProfile) {

  const existingAccessToken =
    localStorage.getItem("kerjivaAccessToken");

  const existingUserData =
    localStorage.getItem("kerjivaUser");

  let existingUser = null;

  try {
    existingUser =
      JSON.parse(existingUserData || "{}");
  } catch {
    existingUser = null;
  }

  if (!existingAccessToken || !existingUser?.id) {
    throw new Error(
      "Sesi login tidak ditemukan. Silakan masuk kembali."
    );
  }

  const companyResponse = await fetch(
    `${SUPABASE_URL}companies`,
    {
      method: "POST",

      headers: {
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${existingAccessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },

      body: JSON.stringify({
        user_id: existingUser.id,
        company_name: companyName,
        email: email,
        phone: companyPhone,
        website: companyWebsite,
        city: companyCity,
        address: companyAddress
      })
    }
  );

  if (!companyResponse.ok) {
    const companyError =
      await companyResponse.text();

    throw new Error(companyError);
  }

 window.kerjivaCompletingCompanyProfile = false;

isRegister = false;
isCompany = true;

localStorage.setItem(
  "kerjivaActiveRole",
  "company"
);
  modal.classList.add("hidden");

  showNotification("loginSuccess");

  showCompanyDashboard();

  return;
}
  // ==================================================
// TAMBAH ROLE PERUSAHAAN KE AKUN AUTH YANG SUDAH ADA
// ==================================================

if (
  isRegister &&
  isCompany &&
  !window.kerjivaCompletingCompanyProfile
) {

  // Login ke akun Auth yang sudah ada
  const existingLoginResponse =
    await fetch(
      `${authUrl}/token?grant_type=password`,
      {
        method: "POST",

        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

  const existingLoginData =
    await existingLoginResponse.json();

  // Jika email + password cocok,
  // berarti ini akun Auth yang sudah ada.
  if (
    existingLoginResponse.ok &&
    existingLoginData.access_token &&
    existingLoginData.user?.id
  ) {

    const existingAccessToken =
      existingLoginData.access_token;

    const existingUser =
      existingLoginData.user;

    // Cek apakah role Company sudah ada
    const companyCheck =
      await fetch(
        `${SUPABASE_URL}companies?user_id=eq.${existingUser.id}&select=id`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization:
              `Bearer ${existingAccessToken}`
          }
        }
      );

    if (!companyCheck.ok) {
      throw new Error(
        await companyCheck.text()
      );
    }

    const existingCompanies =
      await companyCheck.json();

    // Jika belum ada, buat profil Company
    if (!existingCompanies.length) {

      const companyResponse =
        await fetch(
          `${SUPABASE_URL}companies`,
          {
            method: "POST",

            headers: {
              apikey: SUPABASE_KEY,
              Authorization:
                `Bearer ${existingAccessToken}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal"
            },

            body: JSON.stringify({
              user_id: existingUser.id,
              company_name: companyName,
              email: email,
              phone: companyPhone,
              website: companyWebsite,
              city: companyCity,
              address: companyAddress
            })
          }
        );

      if (!companyResponse.ok) {
        const companyError =
          await companyResponse.text();

        throw new Error(companyError);
      }
    }

    // Simpan session akun Auth yang sama
    localStorage.setItem(
      "kerjivaAccessToken",
      existingAccessToken
    );

    localStorage.setItem(
      "kerjivaUser",
      JSON.stringify(existingUser)
    );

    localStorage.setItem(
      "kerjivaActiveRole",
      "company"
    );

    isRegister = false;
    isCompany = false;

    modal.classList.add("hidden");

    showCompanyDashboard();

    showNotification("loginSuccess");

    return;
  }

  // Jika email/password tidak cocok,
  // jangan membuat akun Auth baru secara diam-diam.
  const language =
    localStorage.getItem("siteLanguage") || "id";

  alert(
    language === "en"
      ? "This email is already registered. Please use the correct password to add the Company role."
      : "Email ini sudah terdaftar. Gunakan password yang benar untuk menambahkan role Perusahaan."
  );

  return;
}
    // ==================================================
    // SUPABASE AUTH
    // ==================================================
      console.log(
           "AUTH MODE SEBELUM FETCH:",
             isRegister,
           "IS COMPANY:",
              isCompany
         );

    const response = await fetch(
      isRegister
        ? `${authUrl}/signup`
        : `${authUrl}/token?grant_type=password`,
      {
        method: "POST",

        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json"
        },

        body: JSON.stringify(
          isRegister
            ? {
                email,
                password,

                data: isCompany
                  ? {
                      account_type: "company"
                    }
                  : {
                      account_type: "jobseeker",
                      first_name: firstName,
                      last_name: lastName,
                      full_name:
                        `${firstName} ${lastName}`.trim(),
                      phone: jobseekerPhone,
                      city: jobseekerCity
                    }
              }
            : {
                email,
                password
              }
        )
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.msg ||
        data.error_description ||
        data.message ||
        "Gagal"
      );
    }

    // ==================================================
    // PENDAFTARAN
    // ==================================================

    if (isRegister) {

      // ------------------------------------------------
      // PENCARI KERJA
      // ------------------------------------------------

      if (!isCompany && data.user?.id) {

        // Jika signup langsung menghasilkan token,
        // buat profil sekarang.
        if (data.access_token) {

          const profileResponse = await fetch(
            `${SUPABASE_URL}jobseeker_profiles`,
            {
              method: "POST",

              headers: {
                apikey: SUPABASE_KEY,
                Authorization:
                  `Bearer ${data.access_token}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
              },

              body: JSON.stringify({
                id: data.user.id,
                full_name:
                  `${firstName} ${lastName}`.trim(),
                phone: jobseekerPhone,
                city: jobseekerCity
              })
            }
          );

          if (!profileResponse.ok) {
            const profileError =
              await profileResponse.text();

            throw new Error(profileError);
          }
        }
      }
      
            // ------------------------------------------------
// PERUSAHAAN
// ------------------------------------------------

if (isCompany && data.user?.id && data.access_token) {

  const companyResponse = await fetch(
    `${SUPABASE_URL}companies`,
    {
      method: "POST",

      headers: {
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${data.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },

      body: JSON.stringify({
        user_id: data.user.id,
        company_name: companyName,
        email: email,
        phone: companyPhone,
        website: companyWebsite,
        city: companyCity,
        address: companyAddress
      })
    }
  );

  if (!companyResponse.ok) {
    const companyError =
      await companyResponse.text();

    throw new Error(companyError);
  }
}

    // ------------------------------------------------
// SELESAI DAFTAR
// ------------------------------------------------

const registeredAccountType =
  isCompany ? "company" : "jobseeker";
      console.log("DEBUG: SHOW REGISTRATION NOTIFICATION");

showRegistrationNotification();

// ==================================================
// JIKA SIGNUP LANGSUNG MEMBERIKAN SESSION
// LANGSUNG MASUK SESUAI JENIS AKUN
// ==================================================

if (data.access_token && data.user?.id) {

  localStorage.setItem(
    "kerjivaAccessToken",
    data.access_token
  );

  localStorage.setItem(
    "kerjivaUser",
    JSON.stringify(data.user)
  );
  
    localStorage.setItem(
    "kerjivaActiveRole",
    registeredAccountType
  );

  isRegister = false;
  isCompany = false;

  modal.classList.add("hidden");

  if (registeredAccountType === "company") {
    showCompanyDashboard();
  } else {
    showJobseekerDashboard();
  }

  showNotification("loginSuccess");

  return;
}

// ==================================================
// JIKA BELUM ADA SESSION
// KEMBALI KE MODE MASUK
// ==================================================

isRegister = false;
isCompany = false;

const isEnglish =
  localStorage.getItem("siteLanguage") === "en";

modalTitle.textContent =
  isEnglish ? "Log In" : "Masuk";

modalText.textContent =
  isEnglish
    ? "Enter your email and password to log in."
    : "Masukkan email dan password untuk masuk.";

const accountTypeElement =
  document.querySelector("#accountType");

if (accountTypeElement) {
  accountTypeElement.style.display = "none";
}
const jobseekerFields =
  document.querySelector("#jobseekerFields");

if (jobseekerFields) {
  jobseekerFields.style.display = "none";
}

const companyFields =
  document.querySelector("#companyFields");

if (companyFields) {
  companyFields.style.display = "none";
}

const confirmPasswordField =
  document.querySelector("#confirmPasswordField");

if (confirmPasswordField) {
  confirmPasswordField.style.display = "none";
}

const confirmPasswordInput =
  document.querySelector("#confirmPassword");

if (confirmPasswordInput) {
  confirmPasswordInput.value = "";
}

const switchAuth =
  document.querySelector("#switchAuth");

if (switchAuth) {
  switchAuth.textContent =
    isEnglish ? "Sign Up" : "Daftar";
}

const submitButton =
  authForm.querySelector('button[type="submit"]');

if (submitButton) {
  submitButton.textContent =
    isEnglish ? "Log In" : "Masuk";
}

return;
      }
    // ==================================================
    // LOGIN
    // ==================================================

    localStorage.setItem(
      "kerjivaAccessToken",
      data.access_token || ""
    );

    localStorage.setItem(
      "kerjivaUser",
      JSON.stringify(data.user || {})
    );

  // ==================================================
// CEK ROLE YANG DIPILIH SAAT LOGIN
// ==================================================

const metadata =
  data.user?.user_metadata || {};

console.log("IS COMPANY SAAT LOGIN:", isCompany);

const selectedRole =
  isCompany ? "company" : "jobseeker";

console.log("ROLE YANG DIPILIH:", selectedRole);
    
localStorage.setItem(
  "kerjivaActiveRole",
  selectedRole
);
    // ==================================================
// SINKRONKAN SESSION KE SUPABASE AUTH
// ==================================================
if (data.access_token && data.refresh_token) {
  const { error: sessionError } =
    await supabaseAuth.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token
    });

  if (sessionError) {
    console.error(
      "Gagal menyimpan session Supabase:",
      sessionError
    );
  }
}


// ==================================================
// PENCARI KERJA
// ==================================================

if (!isCompany) {

  if (!data.user?.id) {
    throw new Error(
      "User ID tidak ditemukan."
    );
  }

  const userId = data.user.id;

  const profileCheck = await fetch(
    `${SUPABASE_URL}jobseeker_profiles?id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${data.access_token}`
      }
    }
  );

  if (!profileCheck.ok) {
    throw new Error(
      await profileCheck.text()
    );
  }

  const existingProfiles =
    await profileCheck.json();

  // ----------------------------------------------
  // PROFIL SUDAH ADA
  // ----------------------------------------------

 if (existingProfiles.length) {

  modal.classList.add("hidden");

  showNotification("loginSuccess");

  setTimeout(() => {
    showJobseekerDashboard();
  }, 800);

  return;
}

  // ----------------------------------------------
  // PROFIL BELUM ADA
  // AMBIL DATA DARI SUPABASE AUTH METADATA
  // ----------------------------------------------

  const userMetadata =
    data.user?.user_metadata || {};

  const firstName =
    userMetadata.first_name || "";

  const lastName =
    userMetadata.last_name || "";

  const fullName =
    userMetadata.full_name ||
    `${firstName} ${lastName}`.trim();

  const phone =
    userMetadata.phone || "";

  const city =
    userMetadata.city || "";

  // ----------------------------------------------
  // BUAT PROFIL DARI DATA PENDAFTARAN
  // ----------------------------------------------

  const profileResponse = await fetch(
    `${SUPABASE_URL}jobseeker_profiles`,
    {
      method: "POST",

      headers: {
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${data.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },

      body: JSON.stringify({
        id: userId,
        full_name: fullName,
        phone: phone,
        city: city
      })
    }
  );

  if (!profileResponse.ok) {

    const profileError =
      await profileResponse.text();

    throw new Error(profileError);
  }

  // ----------------------------------------------
  // PROFIL BERHASIL DIBUAT
  // LANGSUNG KE DASHBOARD
  // ----------------------------------------------

  modal.classList.add("hidden");

  showNotification("loginSuccess");

  setTimeout(() => {
    showJobseekerDashboard();
  }, 800);

  return;
}


// ==================================================
// PERUSAHAAN
// ==================================================

if (isCompany) {

  if (!data.user?.id) {
    throw new Error(
      "User ID tidak ditemukan."
    );
  }

  const companyCheck = await fetch(
    `${SUPABASE_URL}companies?user_id=eq.${data.user.id}&select=id`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization:
          `Bearer ${data.access_token}`
      }
    }
  );

  if (!companyCheck.ok) {
    throw new Error(
      await companyCheck.text()
    );
  }

  const existingCompanies =
    await companyCheck.json();

  // ----------------------------------------------
  // PROFIL PERUSAHAAN SUDAH ADA
  // ----------------------------------------------

  if (existingCompanies.length) {

    modal.classList.add("hidden");

    showNotification("loginSuccess");

    setTimeout(() => {
      showCompanyDashboard();
    }, 800);

    return;
  }

  // ----------------------------------------------
  // PROFIL PERUSAHAAN BELUM ADA
  // ----------------------------------------------

  showCompanyRegistrationAfterLogin();

  return;
}


throw new Error(
  "Jenis akun belum dapat diproses."
);


} catch (error) {

  console.error(
    "AUTH ERROR:",
    error
  );

  const language =
    localStorage.getItem("siteLanguage") || "id";

  const errorMessage =
    error?.message || "";

  if (
    errorMessage.toLowerCase().includes(
      "invalid login credentials"
    )
  ) {

    alert(
      language === "en"
        ? "Invalid login credentials."
        : "Email atau password salah."
    );

    return;
  }

  showNotification("invalidAccount");
}
});
  
  
// ==================================================
// NOTIFIKASI PENDAFTARAN BERHASIL
// ==================================================

function showRegistrationNotification() {

  const language =
    localStorage.getItem("siteLanguage") || "id";

  const isEnglish =
    language === "en";

  const oldNotification =
    document.querySelector(
      "#kerjivaRegistrationNotification"
    );

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification =
    document.createElement("div");

  notification.id =
    "kerjivaRegistrationNotification";

  notification.className =
    "kerjiva-registration-notification";
  
  notification.style.position = "fixed";
  notification.style.top = "8%";
  notification.style.left = "78%";
  notification.style.transform = "translateX(-50%)";
  notification.style.zIndex = "999999";
  notification.style.background = "#ffffff";
  notification.style.padding = "20px 24px";
  notification.style.borderRadius = "14px";
  notification.style.boxShadow = "0 8px 30px rgba(0,0,0,0.20)";
  notification.style.border = "1px solid #e5e7eb";
  notification.style.borderLeft = "5px solid #16a34a";
  
  notification.innerHTML = `

  <div class="kerjiva-registration-icon">
    <strong>✓</strong>
  </div>
    <div class="kerjiva-registration-content">

      <div class="kerjiva-registration-title">
        ${
          isEnglish
            ? "Registration Successful!"
            : "Pendaftaran Berhasil!"
        }
      </div>

      <div class="kerjiva-registration-message">
        ${
          isEnglish
            ? "Your account has been created.<br>Please check your email and click the confirmation link to activate your account.<br>After that, you can log in to Kerjiva."
            : "Akun Anda berhasil dibuat.<br>Silakan cek email Anda dan klik link konfirmasi untuk mengaktifkan akun.<br>Setelah itu, Anda dapat masuk ke Kerjiva."
        }
      </div>

    </div>

    <button
      type="button"
      class="kerjiva-registration-ok"
    >
      OK
    </button>

  `;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  const okButton =
    notification.querySelector(
      ".kerjiva-registration-ok"
    );

  okButton.addEventListener("click", () => {

    notification.classList.remove("show");

    setTimeout(() => {
      notification.remove();
    }, 250);

  });

}
// ================= DASHBOARD PENCARI KERJA =================

 window.showJobseekerDashboard = async function () {
    
      const activeRole =
    localStorage.getItem("kerjivaActiveRole");

  if (activeRole !== "jobseeker") {
    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";

    alert(
      isEnglish
        ? "Please log out first, then log in as a Job Seeker."
        : "Silakan logout terlebih dahulu, lalu login sebagai Pencari Kerja."
    );

    return;
  }
  const language = localStorage.getItem("siteLanguage") || "id";

const userData = localStorage.getItem("kerjivaUser");
const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    alert(
      language === "en"
        ? "Job seeker session not found. Please log in again."
        : "Sesi pencari kerja tidak ditemukan. Silakan login kembali."
    );
    return;
  }

  const dashboard = document.createElement("div");
  dashboard.id = "jobseekerDashboard";
  const currentLanguage = localStorage.getItem("siteLanguage") || "id";

  dashboard.innerHTML = `
    <div style="
      min-height:100vh;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      color:#1f2937;
    ">

          <div style="
        background:#123b6d;
        color:white;
        padding:20px 30px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        box-shadow:0 3px 12px rgba(0,0,0,.15);
      ">
        <div>
        <img
          src="kerjiva.png"
          alt="Kerjiva"
          style="
          width:230px;
          height:auto;
          display:block;
          background:#fff;
          border-radius:6px;
         "
        >

          <div style="
            font-size:13px;
            opacity:.85;
            margin-top:4px;
          ">
            Dashboard Pencari Kerja
          </div>
        </div>

        <button
          onclick="location.reload()"
          style="
            background:white;
            color:#123b6d;
            border:none;
            padding:10px 18px;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
          "
        >
          🔎 Cari Lowongan
        </button>
      </div>

      <!-- CONTENT --> 
      <!-- CONTENT -->
      <div style="
        max-width:1100px;
        margin:auto;
        padding:35px 25px;
      ">

        <div style="
          margin-bottom:30px;
        ">
          <h1 style="
            margin:0;
            font-size:30px;
            color:#172b4d;
          ">
            Selamat Datang 👋
          </h1>

          <p style="
            margin-top:8px;
            color:#64748b;
            font-size:16px;
          ">
            Kelola CV dan persiapkan dirimu untuk mendapatkan pekerjaan.
          </p>
        </div>

        <!-- STATISTIK -->
        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:18px;
          margin-bottom:30px;
        ">
        <div
  onclick="showJobseekerProfile()"
  style="
    cursor:pointer;
    background:white;
    padding:22px;
    border-radius:14px;
    box-shadow:0 3px 12px rgba(15,23,42,.07);
    border:1px solid #e5eaf1;
  "
>
  <div style="font-size:13px;color:#64748b;">
    Profil Diri
  </div>

  <div style="
    font-size:24px;
    font-weight:bold;
    margin-top:8px;
    color:#123b6d;
  ">
👤 Lengkapi Profil
  </div>
</div>

         <div
            style=" 
          
            
            background:white;
            padding:22px;
            border-radius:14px;
            cursor:pointer;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              CV Saya
            </div>

            <div style="
              font-size:24px;
              font-weight:bold;
              margin-top:8px;
              color:#123b6d;
            ">
              Belum Upload
            </div>
          </div>

          <div
            onclick="showMyApplications()"
            style="
            cursor:pointer;
            background:white;
            padding:22px;
            border-radius:14px;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              Lamaran Saya
            </div>

            <div style="
              font-size:30px;
              font-weight:bold;
              margin-top:8px;
              color:#16805c;
            ">
              <span id="myApplicationsCount">0</span>
            </div>
          </div>

         <div style="
  background:linear-gradient(135deg,#ffffff 0%,#f5f3ff 100%);
  padding:22px;
  border-radius:14px;
  box-shadow:0 3px 12px rgba(15,23,42,.07);
  border:1px solid #e5eaf1;
">
  <div style="
    display:flex;
    align-items:center;
    gap:8px;
    font-size:13px;
    color:#64748b;
  ">
  <span style="font-size:18px;">🔔</span>
  ${currentLanguage === "en" ? "Application Progress" : "Perkembangan Lamaran"}
  </div>

  <div style="
    font-size:30px;
    font-weight:bold;
    margin-top:8px;
    color:#7c3aed;
  ">
    <span id="applicationProgressCount">0</span>
  </div>

  <div style="
    margin-top:4px;
    font-size:12px;
    color:#64748b;
  ">
    Lamaran terkirim
  </div>
</div>

          <div style="
            background:white;
            padding:22px;
            border-radius:14px;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              Notifikasi
            </div>

            <div style="
              font-size:30px;
              font-weight:bold;
              margin-top:8px;
              color:#ea580c;
            ">
              0
            </div>
          </div>

        </div>

        <!-- PERKEMBANGAN LAMARAN -->
<div
  id="applicationProgressList"
  style="
    margin-top:20px;
    background:white;
    padding:25px;
    border-radius:16px;
    box-shadow:0 3px 15px rgba(15,23,42,.07);
    border:1px solid #e5eaf1;
  "
>
  <h2 style="
    margin:0 0 18px;
    color:#172b4d;
    font-size:20px;
  ">
 🔔 ${currentLanguage === "en" ? "Application Progress" : "Perkembangan Lamaran"}
  </h2>

<div id="applicationProgressContent">

  <select
    id="applicationProgressSelect"
    style="
      width:100%;
      padding:13px 15px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:white;
      color:#172b4d;
      font-size:14px;
      cursor:pointer;
      outline:none;
    "
  >
    <option value="">Memuat perkembangan lamaran...</option>
  </select>

  <div
    id="applicationProgressDetail"
    style="margin-top:15px;"
  ></div>

</div>
</div>
          
            <!-- DOKUMEN SAYA -->
          <div style="
          margin-top:16px;
          background:white;
          padding:24px;
          border-radius:16px;
          box-shadow:0 3px 15px rgba(15,23,42,.07);
          border:1px solid #e5eaf1;
        ">

          <h2 style="
            margin-top:0;
            color:#172b4d;
            font-size:22px;
          ">
            📁 ${currentLanguage === "en" ? "My Documents" : "Dokumen Saya"}
          </h2>

          <p style="
            color:#64748b;
            margin-bottom:22px;
          ">
            ${currentLanguage === "en"
              ? "Upload and manage the documents you may need when applying for jobs."
              : "Upload dan kelola dokumen yang mungkin kamu perlukan saat melamar pekerjaan."}
          </p>

          <div style="
            display:grid;
            gap:14px;
          ">
        <!-- CV -->
<div style="
  padding:18px;
  border:1px solid #e5eaf1;
  border-radius:12px;
  background:#f8fafc;
">

  <strong>
    📄 ${currentLanguage === "en" ? "My CV" : "CV Saya"}
  </strong>

  <div style="
    margin-top:6px;
    color:#64748b;
    font-size:14px;
  ">
    ${currentLanguage === "en"
      ? "Upload your CV in PDF format so companies can view your profile and work experience."
      : "Upload CV dalam format PDF agar perusahaan dapat melihat profil dan pengalaman kerja kamu."}
  </div>

 <input
  type="file"
  id="cvFileInput"
  accept=".pdf,application/pdf"
  style="display:none;"
>

<label
  for="cvFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${localStorage.getItem("siteLanguage") === "en"
    ? "Choose File"
    : "Pilih File"}
</label>
<span
  id="cvFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${localStorage.getItem("siteLanguage") === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>



<button
    id="uploadCvBtn"
    style="
      margin-top:12px;
      padding:10px 18px;
      background:#123b6d;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    Upload CV
  </button>

  <div
    id="cvStatus"
    style="
      margin-top:12px;
      font-weight:bold;
    "
  ></div>

</div>
          <div style="
  padding:18px;
  border:1px solid #e5eaf1;
  border-radius:12px;
  background:#f8fafc;
">

  <strong>
    📄 ${currentLanguage === "en" ? "Resume" : "Daftar Riwayat Hidup"}
  </strong>

  <div style="
    margin-top:6px;
    color:#64748b;
    font-size:14px;
  ">
    ${currentLanguage === "en"
      ? "Upload your resume or curriculum vitae."
      : "Upload daftar riwayat hidup atau resume kamu."}
  </div>

<input
  type="file"
  id="resumeFileInput"
  accept=".pdf,application/pdf"
  style="display:none;"
>

<label
  for="resumeFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Choose File"
    : "Pilih File"}
</label>

<span
  id="resumeFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${currentLanguage === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>

  <button
    id="uploadResumeBtn"
    style="
      margin-top:12px;
      padding:10px 18px;
      background:#123b6d;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    ${currentLanguage === "en" ? "Upload Resume" : "Upload Daftar Riwayat Hidup"}
  </button>

   <div
    id="resumeStatus"
    style="
      margin-top:12px;
      font-weight:bold;
    "
  ></div>

            <div
            id="resumeDisplay"
            style="
            margin-top:12px;
            "
            ></div>
            <div style="
              padding:18px;
              border:1px solid #e5eaf1;
              border-radius:12px;
              background:#f8fafc;
            ">
            <strong style="display:block;">
                📑 ${currentLanguage === "en"
                 ? "Work Experience Letter"
                 : "Paklaring / Surat Pengalaman Kerja"}
             </strong>
             <input
                type="file"
                id="workLetterFileInput"
                accept=".pdf,application/pdf"
                style="display:none;"
                 >

             <label
                for="workLetterFileInput"
                style="
                display:block;
                width:max-content;
                margin-top:15px;
                padding:11px 18px;
                background:#e8eef7;
                color:#123b6d;
                border-radius:8px;
                cursor:pointer;
                font-size:14px;
                font-weight:bold;
                "
                >
                ${currentLanguage === "en"
                 ? "Choose File"
                 : "Pilih File"}
               </label>

               <span
               id="workLetterFileName"
               style="
               display:block;
               margin-top:10px;
               color:#64748b;
               font-size:13px;
               "
               >
               ${currentLanguage === "en"
                  ? "No file chosen"
                   : "Tidak ada file yang dipilih"}
               </span>

               <button
               id="uploadWorkLetterBtn"
               style="
               margin-top:12px;
               padding:10px 18px;
               background:#123b6d;
               color:white;
               border:none;
               border-radius:8px;
               cursor:pointer;
               font-weight:bold;
               "
               >
                ${currentLanguage === "en"
                ? "Upload Work Experience Letter"
                : "Upload Paklaring"}
               </button>

               <div
               id="workLetterStatus"
               style="
               margin-top:12px;
               font-weight:bold;
               "
               ></div>

               <div
               id="workLetterDisplay"
               style="
               margin-top:12px;
               "
              ></div>
              <div style="
                margin-top:6px;
                color:#64748b;
                font-size:14px;
              ">
                ${currentLanguage === "en"
                  ? "Upload documents that prove your previous work experience."
                  : "Upload dokumen yang membuktikan pengalaman kerja sebelumnya."}
              </div>
            </div>

            <div style="
              padding:18px;
              border:1px solid #e5eaf1;
              border-radius:12px;
              background:#f8fafc;
            ">
              <strong>🎓 ${currentLanguage === "en" ? "Education Certificate" : "Ijazah / Sertifikat"}</strong>
              <div style="
                margin-top:6px;
                color:#64748b;
                font-size:14px;
              ">
                ${currentLanguage === "en"
                  ? "Upload education certificates or other supporting certificates."
                  : "Upload ijazah atau sertifikat pendukung lainnya."}
              </div>
           <input
  type="file"
  id="educationFileInput"
  accept=".pdf,application/pdf"
  style="display:none;"
>

<label
  for="educationFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Choose File"
    : "Pilih File"}
</label>

<span
  id="educationFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${currentLanguage === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>

<button
  id="uploadEducationBtn"
  style="
    margin-top:12px;
    padding:10px 18px;
    background:#123b6d;
    color:white;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Upload Certificate"
    : "Upload Ijazah / Sertifikat"}
</button>

<div
  id="educationStatus"
  style="
    margin-top:12px;
    font-weight:bold;
  "
></div>

<div
  id="educationDisplay"
  style="
    margin-top:12px;
  "
></div>
            </div>

            <div style="
              padding:18px;
              border:1px solid #e5eaf1;
              border-radius:12px;
              background:#f8fafc;
            ">
              <strong>📎 ${currentLanguage === "en" ? "Other Documents" : "Dokumen Lainnya"}</strong>
              <div style="
                margin-top:6px;
                color:#64748b;
                font-size:14px;
              ">
                ${currentLanguage === "en"
                  ? "Upload other documents that may support your application."
                  : "Upload dokumen lain yang mungkin mendukung lamaran kamu."}
              </div>
            <input
  type="file"
  id="otherDocumentFileInput"
  accept=".pdf,application/pdf"
  style="display:none;"
>

<label
  for="otherDocumentFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Choose File"
    : "Pilih File"}
</label>

<span
  id="otherDocumentFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${currentLanguage === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>

<button
  id="uploadOtherDocumentBtn"
  style="
    margin-top:12px;
    padding:10px 18px;
    background:#123b6d;
    color:white;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Upload Document"
    : "Upload Dokumen"}
</button>

<div
  id="otherDocumentStatus"
  style="
    margin-top:12px;
    font-weight:bold;
  "
></div>

<div
  id="otherDocumentDisplay"
  style="
    margin-top:12px;
  "
></div>
            </div>
<!-- KTP -->
<div style="
  padding:18px;
  border:1px solid #e5eaf1;
  border-radius:12px;
  background:#f8fafc;
">
  <strong>
    🪪 ${currentLanguage === "en" ? "ID Card (KTP)" : "KTP"}
  </strong>

  <div style="
    margin-top:6px;
    color:#64748b;
    font-size:14px;
  ">
    ${currentLanguage === "en"
      ? "Upload a photo or scan of your ID card."
      : "Upload foto atau scan KTP kamu."}
  </div>

<input
  type="file"
  id="ktpFileInput"
  accept="image/jpeg,image/png"
  style="display:none;"
>

<label
  for="ktpFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Choose File"
    : "Pilih File"}
</label>

<span
  id="ktpFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${currentLanguage === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>

  <button
    id="uploadKtpBtn"
    style="
      margin-top:12px;
      padding:10px 18px;
      background:#123b6d;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    ${currentLanguage === "en"
      ? "Upload ID Card"
      : "Upload KTP"}
  </button>

  <div
    id="ktpStatus"
    style="
      margin-top:12px;
      font-weight:bold;
    "
  ></div>

  <div
    id="ktpDisplay"
    style="
      margin-top:12px;
    "
  ></div>
</div>
<!-- SIM A -->
<div style="
  padding:18px;
  border:1px solid #e5eaf1;
  border-radius:12px;
  background:#f8fafc;
">
  <strong>
    🚗 ${currentLanguage === "en" ? "Driving License (SIM A)" : "SIM A"}
  </strong>

  <div style="
    margin-top:6px;
    color:#64748b;
    font-size:14px;
  ">
    ${currentLanguage === "en"
      ? "Upload a photo or scan of your SIM A."
      : "Upload foto atau scan SIM A kamu."}
  </div>

<input
  type="file"
  id="simAFileInput"
  accept="image/jpeg,image/png"
  style="display:none;"
>

<label
  for="simAFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Choose File"
    : "Pilih File"}
</label>

<span
  id="simAFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${currentLanguage === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>

  <button
    id="uploadSimABtn"
    style="
      margin-top:12px;
      padding:10px 18px;
      background:#123b6d;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    ${currentLanguage === "en"
      ? "Upload SIM A"
      : "Upload SIM A"}
  </button>

  <div
    id="simAStatus"
    style="
      margin-top:12px;
      font-weight:bold;
    "
  ></div>

  <div
    id="simADisplay"
    style="
      margin-top:12px;
    "
  ></div>
</div>

<!-- SIM C -->
<div style="
  padding:18px;
  border:1px solid #e5eaf1;
  border-radius:12px;
  background:#f8fafc;
">
  <strong>
    🛵 ${currentLanguage === "en" ? "Driving License (SIM C)" : "SIM C"}
  </strong>

  <div style="
    margin-top:6px;
    color:#64748b;
    font-size:14px;
  ">
    ${currentLanguage === "en"
      ? "Upload a photo or scan of your SIM C."
      : "Upload foto atau scan SIM C kamu."}
  </div>

<input
  type="file"
  id="simCFileInput"
  accept="image/jpeg,image/png"
  style="display:none;"
>

<label
  for="simCFileInput"
  style="
    display:inline-block;
    margin-top:15px;
    padding:11px 18px;
    background:#e8eef7;
    color:#123b6d;
    border-radius:8px;
    cursor:pointer;
    font-size:14px;
    font-weight:bold;
  "
>
  ${currentLanguage === "en"
    ? "Choose File"
    : "Pilih File"}
</label>

<span
  id="simCFileName"
  style="
    display:block;
    margin-top:10px;
    color:#64748b;
    font-size:13px;
  "
>
  ${currentLanguage === "en"
    ? "No file chosen"
    : "Tidak ada file yang dipilih"}
</span>

  <button
    id="uploadSimCBtn"
    style="
      margin-top:12px;
      padding:10px 18px;
      background:#123b6d;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    ${currentLanguage === "en"
      ? "Upload SIM C"
      : "Upload SIM C"}
  </button>

  <div
    id="simCStatus"
    style="
      margin-top:12px;
      font-weight:bold;
    "
  ></div>

  <div
    id="simCDisplay"
    style="
      margin-top:12px;
    "
  ></div>
</div>

          </div>

        </div>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(dashboard);
  translateJobseekerDashboard(dashboard);
    loadInterviewInvitations();
    // ================= DOKUMEN: PAKLARING =================

const uploadWorkLetterBtn = document.querySelector("#uploadWorkLetterBtn");
const workLetterFileInput = document.querySelector("#workLetterFileInput");
const workLetterStatus = document.querySelector("#workLetterStatus");
    const workLetterFileName = document.querySelector("#workLetterFileName");

if (workLetterFileName && workLetterFileInput) {
  workLetterFileInput.addEventListener("change", () => {
    if (workLetterFileInput.files.length > 0) {
      workLetterFileName.textContent = workLetterFileInput.files[0].name;
    } else {
      workLetterFileName.textContent =
        currentLanguage === "en"
          ? "No file chosen"
          : "Tidak ada file yang dipilih";
    }
  });
}

if (uploadWorkLetterBtn && workLetterFileInput && workLetterStatus) {

  uploadWorkLetterBtn.addEventListener("click", async () => {

    const file = workLetterFileInput.files[0];

    if (!file) {
      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Please select a work experience letter first."
          : "Pilih file paklaring terlebih dahulu.";
      return;
    }

    if (file.type !== "application/pdf") {
      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Work experience letter must be a PDF file."
          : "Paklaring harus berupa file PDF.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

  const token = localStorage.getItem("kerjivaAccessToken");
  const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Uploading work experience letter..."
          : "Mengupload paklaring...";

      const filePath =
        `${user.id}/work-letter/${Date.now()}_${file.name}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "work_letter",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Work experience letter uploaded successfully."
          : "Paklaring berhasil diupload.";

      workLetterFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload paklaring:", error);

      workLetterStatus.textContent =
        currentLanguage === "en"
          ? "Work experience letter upload failed."
          : "Gagal mengupload paklaring.";
    }

  });

}
    // ================= TAMPILKAN PAKLARING =================

const workLetterDisplay = document.querySelector("#workLetterDisplay");

if (workLetterDisplay && userData && accessToken) {

  const workLetterUser = JSON.parse(userData);

  try {

    const workLetterResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${workLetterUser.id}&document_type=eq.work_letter&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!workLetterResponse.ok) {
      throw new Error(await workLetterResponse.text());
    }

    const documents = await workLetterResponse.json();

    if (documents.length > 0) {

      const workLetter = documents[0];

      workLetterDisplay.innerHTML = `
        <a
          href="#"
          id="viewWorkLetterBtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          📑 ${
            currentLanguage === "en"
              ? "View Work Experience Letter"
              : "Lihat Paklaring"
          }
        </a>
      `;

      document
        .querySelector("#viewWorkLetterBtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(workLetter.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error("Gagal membuka paklaring:", error);

            alert(
              currentLanguage === "en"
                ? "Failed to open work experience letter."
                : "Gagal membuka paklaring."
            );
          }

        });

    } else {

      workLetterDisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No work experience letter uploaded yet."
              : "Belum ada paklaring yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error("Gagal mengambil paklaring:", error);

    workLetterDisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load work experience letter."
            : "Gagal memuat paklaring."
        }
      </div>
    `;
  }
}
    // ================= DOKUMEN: IJAZAH / SERTIFIKAT =================

const uploadEducationBtn = document.querySelector("#uploadEducationBtn");
const educationFileInput = document.querySelector("#educationFileInput");
const educationStatus = document.querySelector("#educationStatus");
    const educationFileName = document.querySelector("#educationFileName");

if (educationFileName && educationFileInput) {
  educationFileInput.addEventListener("change", () => {
    if (educationFileInput.files.length > 0) {
      educationFileName.textContent = educationFileInput.files[0].name;
    } else {
      educationFileName.textContent =
        currentLanguage === "en"
          ? "No file chosen"
          : "Tidak ada file yang dipilih";
    }
  });
}

if (uploadEducationBtn && educationFileInput && educationStatus) {

  uploadEducationBtn.addEventListener("click", async () => {

    const file = educationFileInput.files[0];

    if (!file) {
      educationStatus.textContent =
        currentLanguage === "en"
          ? "Please select a certificate file first."
          : "Pilih file ijazah atau sertifikat terlebih dahulu.";
      return;
    }

    if (file.type !== "application/pdf") {
      educationStatus.textContent =
        currentLanguage === "en"
          ? "Certificate must be a PDF file."
          : "Ijazah atau sertifikat harus berupa file PDF.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      educationStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

      const token = localStorage.getItem("kerjivaAccessToken");
      const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      educationStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      educationStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      educationStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      educationStatus.textContent =
        currentLanguage === "en"
          ? "Uploading certificate..."
          : "Mengupload ijazah / sertifikat...";

      const filePath =
        `${user.id}/education/${Date.now()}_${file.name}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "education",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      educationStatus.textContent =
        currentLanguage === "en"
          ? "Certificate uploaded successfully."
          : "Ijazah / sertifikat berhasil diupload.";

      educationFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload ijazah / sertifikat:", error);

      educationStatus.textContent =
        currentLanguage === "en"
          ? "Certificate upload failed."
          : "Gagal mengupload ijazah / sertifikat.";
    }

  });

}
    // ================= TAMPILKAN IJAZAH / SERTIFIKAT =================

const educationDisplay = document.querySelector("#educationDisplay");

if (educationDisplay && userData && accessToken) {

  const educationUser = JSON.parse(userData);

  try {

    const educationResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${educationUser.id}&document_type=eq.education&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!educationResponse.ok) {
      throw new Error(await educationResponse.text());
    }

    const documents = await educationResponse.json();

    if (documents.length > 0) {

      const education = documents[0];

      educationDisplay.innerHTML = `
        <a
          href="#"
          id="viewEducationBtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          🎓 ${
            currentLanguage === "en"
              ? "View Certificate"
              : "Lihat Ijazah / Sertifikat"
          }
        </a>
      `;

      document
        .querySelector("#viewEducationBtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(education.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error(
              "Gagal membuka ijazah / sertifikat:",
              error
            );

            alert(
              currentLanguage === "en"
                ? "Failed to open certificate."
                : "Gagal membuka ijazah / sertifikat."
            );
          }

        });

    } else {

      educationDisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No certificate uploaded yet."
              : "Belum ada ijazah / sertifikat yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error(
      "Gagal mengambil ijazah / sertifikat:",
      error
    );

    educationDisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load certificate."
            : "Gagal memuat ijazah / sertifikat."
        }
      </div>
    `;
  }
}
    // ================= DOKUMEN: DOKUMEN LAINNYA =================

const uploadOtherDocumentBtn = document.querySelector("#uploadOtherDocumentBtn");
const otherDocumentFileInput = document.querySelector("#otherDocumentFileInput");
const otherDocumentStatus = document.querySelector("#otherDocumentStatus");
    const otherDocumentFileName = document.querySelector("#otherDocumentFileName");

if (otherDocumentFileName && otherDocumentFileInput) {
  otherDocumentFileInput.addEventListener("change", () => {
    if (otherDocumentFileInput.files.length > 0) {
      otherDocumentFileName.textContent = otherDocumentFileInput.files[0].name;
    } else {
      otherDocumentFileName.textContent =
        currentLanguage === "en"
          ? "No file chosen"
          : "Tidak ada file yang dipilih";
    }
  });
}

if (uploadOtherDocumentBtn && otherDocumentFileInput && otherDocumentStatus) {

  uploadOtherDocumentBtn.addEventListener("click", async () => {

    const file = otherDocumentFileInput.files[0];

    if (!file) {
      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Please select a document first."
          : "Pilih dokumen terlebih dahulu.";
      return;
    }

    if (file.type !== "application/pdf") {
      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Document must be a PDF file."
          : "Dokumen harus berupa file PDF.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

 const token = localStorage.getItem("kerjivaAccessToken");
 const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Uploading document..."
          : "Mengupload dokumen...";

      const filePath =
        `${user.id}/other/${Date.now()}_${file.name}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
           Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "other",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Document uploaded successfully."
          : "Dokumen berhasil diupload.";

      otherDocumentFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload dokumen lainnya:", error);

      otherDocumentStatus.textContent =
        currentLanguage === "en"
          ? "Document upload failed."
          : "Gagal mengupload dokumen.";
    }

  });

}
    // ================= TAMPILKAN DOKUMEN LAINNYA =================

const otherDocumentDisplay = document.querySelector("#otherDocumentDisplay");

if (otherDocumentDisplay && userData && accessToken) {

  const otherDocumentUser = JSON.parse(userData);

  try {

    const otherDocumentResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${otherDocumentUser.id}&document_type=eq.other&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!otherDocumentResponse.ok) {
      throw new Error(await otherDocumentResponse.text());
    }

    const documents = await otherDocumentResponse.json();

    if (documents.length > 0) {

      const documentItem = documents[0];

      otherDocumentDisplay.innerHTML = `
        <a
          href="#"
          id="viewOtherDocumentBtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          📎 ${
            currentLanguage === "en"
              ? "View Document"
              : "Lihat Dokumen"
          }
        </a>
      `;

      document
        .querySelector("#viewOtherDocumentBtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(documentItem.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error(
              "Gagal membuka dokumen lainnya:",
              error
            );

            alert(
              currentLanguage === "en"
                ? "Failed to open document."
                : "Gagal membuka dokumen."
            );
          }

        });

    } else {

      otherDocumentDisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No document uploaded yet."
              : "Belum ada dokumen yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error(
      "Gagal mengambil dokumen lainnya:",
      error
    );

    otherDocumentDisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load document."
            : "Gagal memuat dokumen."
        }
      </div>
    `;
  }
}
  // ================= DOKUMEN: KTP =================

const uploadKtpBtn = document.querySelector("#uploadKtpBtn");
const ktpFileInput = document.querySelector("#ktpFileInput");
const ktpStatus = document.querySelector("#ktpStatus");
    const ktpFileName = document.querySelector("#ktpFileName");

if (ktpFileName && ktpFileInput) {
  ktpFileInput.addEventListener("change", () => {
    if (ktpFileInput.files.length > 0) {
      ktpFileName.textContent = ktpFileInput.files[0].name;
    } else {
      ktpFileName.textContent =
        currentLanguage === "en"
          ? "No file chosen"
          : "Tidak ada file yang dipilih";
    }
  });
}

if (uploadKtpBtn && ktpFileInput && ktpStatus) {

  uploadKtpBtn.addEventListener("click", async () => {

    const file = ktpFileInput.files[0];

    if (!file) {
      ktpStatus.textContent =
        currentLanguage === "en"
          ? "Please select a KTP photo first."
          : "Pilih foto KTP terlebih dahulu.";
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      ktpStatus.textContent =
        currentLanguage === "en"
          ? "KTP must be a JPG, JPEG, or PNG image."
          : "KTP harus berupa gambar JPG, JPEG, atau PNG.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      ktpStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

   const token = localStorage.getItem("kerjivaAccessToken");
   const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      ktpStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      ktpStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      ktpStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      ktpStatus.textContent =
        currentLanguage === "en"
          ? "Uploading KTP..."
          : "Mengupload KTP...";

      const fileExt = file.name.split(".").pop().toLowerCase();

      const filePath =
        `${user.id}/ktp/${Date.now()}_ktp.${fileExt}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "ktp",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      ktpStatus.textContent =
        currentLanguage === "en"
          ? "KTP uploaded successfully."
          : "KTP berhasil diupload.";

      ktpFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload KTP:", error);

      ktpStatus.textContent =
        currentLanguage === "en"
          ? "KTP upload failed."
          : "Gagal mengupload KTP.";
    }

  });

}
    // ================= TAMPILKAN KTP =================

const ktpDisplay = document.querySelector("#ktpDisplay");

if (ktpDisplay && userData && accessToken) {

  const ktpUser = JSON.parse(userData);

  try {

    const ktpResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${ktpUser.id}&document_type=eq.ktp&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!ktpResponse.ok) {
      throw new Error(await ktpResponse.text());
    }

    const documents = await ktpResponse.json();

    if (documents.length > 0) {

      const ktp = documents[0];

      ktpDisplay.innerHTML = `
        <a
          href="#"
          id="viewKtpBtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          🪪 ${
            currentLanguage === "en"
              ? "View ID Card"
              : "Lihat KTP"
          }
        </a>
      `;

      document
        .querySelector("#viewKtpBtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(ktp.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error("Gagal membuka KTP:", error);

            alert(
              currentLanguage === "en"
                ? "Failed to open ID card."
                : "Gagal membuka KTP."
            );
          }

        });

    } else {

      ktpDisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No ID card uploaded yet."
              : "Belum ada KTP yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error("Gagal mengambil KTP:", error);

    ktpDisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load ID card."
            : "Gagal memuat KTP."
        }
      </div>
    `;
  }
}
    
    // ================= DOKUMEN: SIM A =================

const uploadSimABtn = document.querySelector("#uploadSimABtn");
const simAFileInput = document.querySelector("#simAFileInput");
const simAStatus = document.querySelector("#simAStatus");
    const simAFileName = document.querySelector("#simAFileName");

if (simAFileName && simAFileInput) {
  simAFileInput.addEventListener("change", () => {
    if (simAFileInput.files.length > 0) {
      simAFileName.textContent = simAFileInput.files[0].name;
    } else {
      simAFileName.textContent =
        currentLanguage === "en"
          ? "No file chosen"
          : "Tidak ada file yang dipilih";
    }
  });
}

if (uploadSimABtn && simAFileInput && simAStatus) {

  uploadSimABtn.addEventListener("click", async () => {

    const file = simAFileInput.files[0];

    if (!file) {
      simAStatus.textContent =
        currentLanguage === "en"
          ? "Please select a SIM A photo first."
          : "Pilih foto SIM A terlebih dahulu.";
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      simAStatus.textContent =
        currentLanguage === "en"
          ? "SIM A must be a JPG, JPEG, or PNG image."
          : "SIM A harus berupa gambar JPG, JPEG, atau PNG.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      simAStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

  const token = localStorage.getItem("kerjivaAccessToken");
  const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      simAStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      simAStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      simAStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      simAStatus.textContent =
        currentLanguage === "en"
          ? "Uploading SIM A..."
          : "Mengupload SIM A...";

      const fileExt = file.name.split(".").pop().toLowerCase();

      const filePath =
        `${user.id}/sim-a/${Date.now()}_sim-a.${fileExt}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "sim_a",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      simAStatus.textContent =
        currentLanguage === "en"
          ? "SIM A uploaded successfully."
          : "SIM A berhasil diupload.";

      simAFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload SIM A:", error);

      simAStatus.textContent =
        currentLanguage === "en"
          ? "SIM A upload failed."
          : "Gagal mengupload SIM A.";
    }

  });

}
    // ================= DOKUMEN: SIM C =================

const uploadSimCBtn = document.querySelector("#uploadSimCBtn");
const simCFileInput = document.querySelector("#simCFileInput");
const simCStatus = document.querySelector("#simCStatus");

if (uploadSimCBtn && simCFileInput && simCStatus) {

  uploadSimCBtn.addEventListener("click", async () => {

    const file = simCFileInput.files[0];

    if (!file) {
      simCStatus.textContent =
        currentLanguage === "en"
          ? "Please select a SIM C photo first."
          : "Pilih foto SIM C terlebih dahulu.";
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      simCStatus.textContent =
        currentLanguage === "en"
          ? "SIM C must be a JPG, JPEG, or PNG image."
          : "SIM C harus berupa gambar JPG, JPEG, atau PNG.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      simCStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

  const token = localStorage.getItem("kerjivaAccessToken");
  const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      simCStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      simCStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      simCStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      simCStatus.textContent =
        currentLanguage === "en"
          ? "Uploading SIM C..."
          : "Mengupload SIM C...";

      const fileExt = file.name.split(".").pop().toLowerCase();

      const filePath =
        `${user.id}/sim-c/${Date.now()}_sim-c.${fileExt}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "sim_c",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      simCStatus.textContent =
        currentLanguage === "en"
          ? "SIM C uploaded successfully."
          : "SIM C berhasil diupload.";

      simCFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload SIM C:", error);

      simCStatus.textContent =
        currentLanguage === "en"
          ? "SIM C upload failed."
          : "Gagal mengupload SIM C.";
    }

  });

}
    // ================= TAMPILKAN SIM C =================

const simCDisplay = document.querySelector("#simCDisplay");

if (simCDisplay && userData && accessToken) {

  const simCUser = JSON.parse(userData);

  try {

    const simCResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${simCUser.id}&document_type=eq.sim_c&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!simCResponse.ok) {
      throw new Error(await simCResponse.text());
    }

    const documents = await simCResponse.json();

    if (documents.length > 0) {

      const simC = documents[0];

      simCDisplay.innerHTML = `
        <a
          href="#"
          id="viewSimCBtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          🛵 ${
            currentLanguage === "en"
              ? "View SIM C"
              : "Lihat SIM C"
          }
        </a>
      `;

      document
        .querySelector("#viewSimCBtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(simC.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error("Gagal membuka SIM C:", error);

            alert(
              currentLanguage === "en"
                ? "Failed to open SIM C."
                : "Gagal membuka SIM C."
            );
          }

        });

    } else {

      simCDisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No SIM C uploaded yet."
              : "Belum ada SIM C yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error("Gagal mengambil SIM C:", error);

    simCDisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load SIM C."
            : "Gagal memuat SIM C."
        }
      </div>
    `;
  }
}
    // ================= TAMPILKAN SIM A =================

const simADisplay = document.querySelector("#simADisplay");

if (simADisplay && userData && accessToken) {

  const simAUser = JSON.parse(userData);

  try {

    const simAResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${simAUser.id}&document_type=eq.sim_a&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!simAResponse.ok) {
      throw new Error(await simAResponse.text());
    }

    const documents = await simAResponse.json();

    if (documents.length > 0) {

      const simA = documents[0];

      simADisplay.innerHTML = `
        <a
          href="#"
          id="viewSimABtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          🚗 ${
            currentLanguage === "en"
              ? "View SIM A"
              : "Lihat SIM A"
          }
        </a>
      `;

      document
        .querySelector("#viewSimABtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(simA.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error("Gagal membuka SIM A:", error);

            alert(
              currentLanguage === "en"
                ? "Failed to open SIM A."
                : "Gagal membuka SIM A."
            );
          }

        });

    } else {

      simADisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No SIM A uploaded yet."
              : "Belum ada SIM A yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error("Gagal mengambil SIM A:", error);

    simADisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load SIM A."
            : "Gagal memuat SIM A."
        }
      </div>
    `;
  }
}
  // ================= DOKUMEN: DAFTAR RIWAYAT HIDUP =================

const uploadResumeBtn = document.querySelector("#uploadResumeBtn");
const resumeFileInput = document.querySelector("#resumeFileInput");
const resumeStatus = document.querySelector("#resumeStatus");
    const resumeFileName = document.querySelector("#resumeFileName");

if (resumeFileName && resumeFileInput) {
  resumeFileInput.addEventListener("change", () => {
    if (resumeFileInput.files.length > 0) {
      resumeFileName.textContent = resumeFileInput.files[0].name;
    } else {
      resumeFileName.textContent =
        currentLanguage === "en"
          ? "No file chosen"
          : "Tidak ada file yang dipilih";
    }
  });
}
    

if (uploadResumeBtn && resumeFileInput && resumeStatus) {

  uploadResumeBtn.addEventListener("click", async () => {

    const file = resumeFileInput.files[0];

    if (!file) {
      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Please select a resume file first."
          : "Pilih file daftar riwayat hidup terlebih dahulu.";
      return;
    }

    if (file.type !== "application/pdf") {
      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Resume must be a PDF file."
          : "Daftar riwayat hidup harus berupa file PDF.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      resumeStatus.textContent =
        currentLanguage === "en"
          ? "File size must not exceed 5 MB."
          : "Ukuran file maksimal 5 MB.";
      return;
    }

   const token = localStorage.getItem("kerjivaAccessToken");
   const userData = localStorage.getItem("kerjivaUser");
    
    if (!token || !userData) {
      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Please log in first."
          : "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Invalid account data. Please log in again."
          : "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      resumeStatus.textContent =
        currentLanguage === "en"
          ? "User ID not found."
          : "ID pengguna tidak ditemukan.";
      return;
    }

    try {

      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Uploading resume..."
          : "Mengupload daftar riwayat hidup...";

      const filePath =
        `${user.id}/resume/${Date.now()}_${file.name}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/jobseeker-documents/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const documentResponse = await fetch(
        `${SUPABASE_URL}jobseeker_documents`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            user_id: user.id,
            document_type: "resume",
            document_name: file.name,
            file_path: filePath
          })
        }
      );

      if (!documentResponse.ok) {
        const errorText = await documentResponse.text();
        throw new Error(errorText);
      }

      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Resume uploaded successfully."
          : "Daftar riwayat hidup berhasil diupload.";

      resumeFileInput.value = "";

    } catch (error) {

      console.error("Gagal upload resume:", error);

      resumeStatus.textContent =
        currentLanguage === "en"
          ? "Resume upload failed."
          : "Gagal mengupload daftar riwayat hidup.";
    }

  });

}

// ================= TAMPILKAN RESUME =================

const resumeDisplay = document.querySelector("#resumeDisplay");

if (resumeDisplay && userData && accessToken) {

  const resumeUser = JSON.parse(userData);

  try {

    const resumeResponse = await fetch(
      `${SUPABASE_URL}jobseeker_documents?user_id=eq.${resumeUser.id}&document_type=eq.resume&select=id,document_name,file_path,created_at&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!resumeResponse.ok) {
      throw new Error(await resumeResponse.text());
    }

    const resumes = await resumeResponse.json();

    if (resumes.length > 0) {

      const resume = resumes[0];

      resumeDisplay.innerHTML = `
        <a
          href="#"
          id="viewResumeBtn"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#e8eef6;
            color:#123b6d;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          📄 ${
            currentLanguage === "en"
              ? "View Resume"
              : "Lihat Daftar Riwayat Hidup"
          }
        </a>
      `;

      document
        .querySelector("#viewResumeBtn")
        .addEventListener("click", async (event) => {

          event.preventDefault();

          try {

            const signResponse = await fetch(
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/jobseeker-documents/")}${encodeURI(resume.file_path)}`,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  expiresIn: 3600
                })
              }
            );

            if (!signResponse.ok) {
              throw new Error(await signResponse.text());
            }

            const signData = await signResponse.json();

            const signedUrl =
              `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signData.signedURL}`;

            window.open(
              signedUrl,
              "_blank",
              "noopener,noreferrer"
            );

          } catch (error) {

            console.error("Gagal membuka resume:", error);

            alert(
              currentLanguage === "en"
                ? "Failed to open resume."
                : "Gagal membuka daftar riwayat hidup."
            );
          }

        });

    } else {

      resumeDisplay.innerHTML = `
        <div style="
          color:#64748b;
          font-size:14px;
        ">
          ${
            currentLanguage === "en"
              ? "No resume uploaded yet."
              : "Belum ada daftar riwayat hidup yang diupload."
          }
        </div>
      `;
    }

  } catch (error) {

    console.error("Gagal mengambil resume:", error);

    resumeDisplay.innerHTML = `
      <div style="
        color:#dc2626;
        font-size:14px;
      ">
        ${
          currentLanguage === "en"
            ? "Failed to load resume."
            : "Gagal memuat daftar riwayat hidup."
        }
      </div>
    `;
  }
}


if (userData && accessToken) {
  const user = JSON.parse(userData);

fetch(
  `${SUPABASE_URL}applications?user_id=eq.${user.id}&select=id,status,rejection_reason,created_at,jobs(title,company_name)&order=created_at.desc`,
  {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  }
)
    .then(response => response.json())
    .then(applications => {
      const countElement = document.querySelector("#myApplicationsCount");

if (countElement) {
  countElement.textContent = applications.length;
}

const progressCount = document.querySelector("#applicationProgressCount");

if (progressCount) {
  progressCount.textContent = applications.length;
}

const progressSelect = document.querySelector("#applicationProgressSelect");
const progressDetail = document.querySelector("#applicationProgressDetail");

if (progressSelect && progressDetail) {

if (applications.length === 0) {

  progressSelect.innerHTML = `
    <option value="">
      ${currentLanguage === "en" ? "No applications yet" : "Belum ada lamaran"}
    </option>
  `;

         progressDetail.innerHTML = `
        <div style="
        padding:18px;
        border-radius:12px;
        background:#f8fafc;
        color:#64748b;
        text-align:center;
      ">
       ${currentLanguage === "en"
         ? "There is no application progress yet."
           : "Belum ada perkembangan lamaran."
       }
      </div>
    `;

  } else {

    progressSelect.innerHTML = `
    <option value="">
     ${currentLanguage === "en" ? "Select an application..." : "Pilih lamaran..."}
    </option>
    ${applications.map(application => `
  <option value="${application.id}">
    ${currentLanguage === "en" ? "Application" : "Lamaran"} #${application.id} —
    ${application.jobs?.title || (currentLanguage === "en" ? "Job Vacancy" : "Lowongan")} —
    ${application.jobs?.company_name || (currentLanguage === "en" ? "Company" : "Perusahaan")}
  </option>
`).join("")}
    `;

    progressSelect.addEventListener("change", () => {

      const selectedId = progressSelect.value;

      if (!selectedId) {
        progressDetail.innerHTML = "";
        return;
      }

      const application = applications.find(
        item => String(item.id) === String(selectedId)
      );

      if (!application) return;

      progressDetail.innerHTML = `
        <div style="
          padding:20px;
          border-radius:12px;
          background:#f8fafc;
          border:1px solid #e5eaf1;
        ">

          <div style="
            font-weight:bold;
            color:#7c3aed;
            margin-bottom:7px;
          ">
        📩 ${currentLanguage === "en" ? "Application" : "Lamaran"} #${application.id}
          </div>

          <div style="
            font-size:17px;
            font-weight:bold;
            color:#172b4d;
          ">
        ${application.jobs?.title || (currentLanguage === "en" ? "Job Vacancy" : "Lowongan")}
          </div>

      <div style="
           margin-top:8px;
           color:#334155;
          ">
          ${
          currentLanguage === "en"
           ? `Your application to <strong>${application.jobs?.company_name || "Company"}</strong> has been successfully submitted.`
           : `Lamaran Anda ke <strong>${application.jobs?.company_name || "Perusahaan"}</strong> telah berhasil terkirim.`
           }
           </div>
         <div style="
  margin-top:6px;
  font-size:13px;
  color:${application.status === "rejected" ? "#dc2626" : "#64748b"};
     ">
         ${
          application.status === "rejected"
          ? (
          currentLanguage === "en"
          ? "Your application has been rejected by the company."
          : "Lamaran Anda ditolak oleh perusahaan."
           )
        : (
         currentLanguage === "en"
          ? "The company will receive and review your application."
          : "Perusahaan akan menerima dan meninjau lamaran Anda."
         )
        }
      </div>

${
  application.status === "rejected" && application.rejection_reason
    ? `
      <div style="
        margin-top:12px;
        padding:12px;
        border-radius:10px;
        background:#fef2f2;
        border:1px solid #fecaca;
        color:#991b1b;
      ">
        <strong>Alasan dari perusahaan:</strong><br>
        ${application.rejection_reason}
      </div>
    `
    : ""
}

          <div style="
            margin-top:10px;
            font-size:12px;
            color:#94a3b8;
          ">
            ${application.created_at
              ? new Date(application.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short"
                })
              : "-"}
          </div>

        </div>
      `;
    });
  }
}
    });
}
      
  const uploadBtn = document.querySelector("#uploadCvBtn");
  const fileInput = document.querySelector("#cvFileInput");
  const status = document.querySelector("#cvStatus");
  const cvFileName = document.querySelector("#cvFileName");

fileInput.addEventListener("change", () => {
  const language = localStorage.getItem("siteLanguage") || "id";

  if (fileInput.files.length > 0) {
    cvFileName.textContent = fileInput.files[0].name;
  } else {
    cvFileName.textContent =
      language === "en"
        ? "No file chosen"
        : "Tidak ada file yang dipilih";
  }
});

  uploadBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];

  if (!file) {
       status.textContent =
       currentLanguage === "en"
       ? "Please select a CV file first."
       : "Pilih file CV terlebih dahulu.";
  return;
   }
   
    if (file.type !== "application/pdf") {
      status.textContent = "CV harus berupa file PDF.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
  status.textContent = "Ukuran CV maksimal 5 MB.";
  return;
    }
    const token = localStorage.getItem("kerjivaAccessToken");
    const userData = localStorage.getItem("kerjivaUser");

    if (!token || !userData) {
      status.textContent = "Silakan login terlebih dahulu.";
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      status.textContent = "Data akun tidak valid. Silakan login kembali.";
      return;
    }

    if (!user.id) {
      status.textContent = "ID pengguna tidak ditemukan.";
      return;
    }

    try {
      status.textContent = "Mengupload CV...";

      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/cv/")}${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type
          },
          body: file
        }
      );

    if (!uploadResponse.ok) {
  const errorText = await uploadResponse.text();
  throw new Error(errorText);
}

const cvUrl =
  `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/public/cv/")}${filePath}`;

const profileResponse = await fetch(
  `${SUPABASE_URL}jobseeker_profiles?id=eq.${user.id}`,
  {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cv_url: cvUrl,
      updated_at: new Date().toISOString()
    })
  }
);

if (!profileResponse.ok) {
  const errorText = await profileResponse.text();
  throw new Error(errorText);
}

status.textContent = "CV berhasil diupload.";
    } catch (error) {
      status.textContent = "Gagal upload CV: " + error.message;
    }
  });
}

    function translateJobseekerDashboard(page) {
  if (!page) return;

  const language = localStorage.getItem("siteLanguage") || "id";

  const translations = {
    "Dashboard Pencari Kerja": "Job Seeker Dashboard",
    "🔎 Cari Lowongan": "🔎 Find Jobs",
    "📅 Undangan Interview": "📅 Interview Invitations",

    "Undangan interview dari": "Interview invitation from",

    "📅 Tanggal:": "📅 Date:",
    "🕐 Jam:": "🕐 Time:",
    "📌 Status:": "📌 Status:",

    "Selamat Datang 👋": "Welcome 👋",
    "Kelola CV dan persiapkan dirimu untuk mendapatkan pekerjaan.":
      "Manage your CV and prepare yourself for your next job.",

    "Profil Diri": "My Profile",
    "👤 Lengkapi Profil": "👤 Complete Profile",

    "CV Saya": "My CV",
    "Belum Upload": "Not Uploaded",

    "Lamaran Saya": "My Applications",
    "Lamaran terkirim": "Applications sent",

    "Perkembangan Lamaran": "Application Progress",

    "Notifikasi": "Notifications",

    "🔔 Perkembangan Lamaran": "🔔 Application Progress",
    "Pilih lamaran...": "Select an application...",

    "📄 CV Saya": "📄 My CV",

    "Upload CV dalam format PDF agar perusahaan dapat melihat profil dan pengalaman kerja kamu.":
      "Upload your CV in PDF format so companies can view your profile and work experience.",

    "Upload CV kamu": "Upload your CV",
    "Format yang diperbolehkan: PDF": "Allowed format: PDF",
    "Upload CV": "Upload CV",

    "Pilih file CV terlebih dahulu.": "Please select a CV file first.",
    "CV harus berupa file PDF.": "CV must be a PDF file.",
    "Silakan login terlebih dahulu.": "Please log in first.",
    "Data akun tidak valid. Silakan login kembali.":
      "Invalid account data. Please log in again.",
    "ID pengguna tidak ditemukan.": "User ID not found.",
    "Mengupload CV...": "Uploading CV...",
    "CV berhasil diupload.": "CV uploaded successfully.",
    "Gagal upload CV:": "CV upload failed:"
  };

   page.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
      const text = element.textContent.trim();

      if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }

      if (language === "en") {

        if (text.startsWith("Undangan interview dari")) {
          element.textContent = text.replace(
            "Undangan interview dari",
            "Interview invitation from"
          );
        }

        if (text.startsWith("📅 Tanggal:")) {
          element.textContent = text.replace(
            "📅 Tanggal:",
            "📅 Date:"
          );
        }

        if (text.startsWith("🕐 Jam:")) {
          element.textContent = text.replace(
            "🕐 Jam:",
            "🕐 Time:"
          );
        }

      }
    }
  });
}
// ================= LAMARAN SAYA =================
async function showMyApplications() {
 const userData = localStorage.getItem("kerjivaUser");
 const language = localStorage.getItem("siteLanguage") || "id";
 const accessToken = localStorage.getItem("kerjivaAccessToken");
if (!userData || !accessToken) {
  showNotification("loginRequired");
  return;
}

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
  showNotification("invalidAccount");
  return;
  }

  if (!user.id) {
  showNotification("userIdNotFound");
    return;
  }

  try {
   const response = await fetch(
  `${SUPABASE_URL}applications?user_id=eq.${user.id}&select=*,jobs(title,company_name)`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const applications = await response.json();

    const page = document.createElement("div");

    page.innerHTML = `
      <div style="
        min-height:100vh;
        background:#f4f7fb;
        font-family:Arial,sans-serif;
        color:#1f2937;
      ">

        <div style="
          background:#123b6d;
          color:white;
          padding:20px 30px;
        ">
          <div style="font-size:24px;font-weight:bold;">
          Kerjiva
          </div>

        <div style="font-size:13px;margin-top:4px;opacity:.85;">
          ${language === "en" ? "My Applications" : "Lamaran Saya"}
        </div>
        </div>

        <div style="
          max-width:1000px;
          margin:auto;
          padding:35px 25px;
        ">

          <button
            onclick="showJobseekerDashboard()"
            style="
              padding:10px 18px;
              margin-bottom:25px;
              background:#123b6d;
              color:white;
              border:none;
              border-radius:8px;
              cursor:pointer;
            "
          >
            ← Dashboard
          </button>

          <h1 style="color:#172b4d;">
            📄 Lamaran Saya
          </h1>

          ${
            applications.length === 0
              ? `
                <div style="
                  background:white;
                  padding:40px;
                  border-radius:14px;
                  text-align:center;
                  border:1px solid #e5eaf1;
                ">
                  <div style="font-size:45px;">📄</div>

                  <h2 style="color:#172b4d;">
                    Belum Ada Lamaran
                  </h2>

                  <p style="color:#64748b;">
                    Lamaran pekerjaan yang kamu kirim akan muncul di sini.
                  </p>
                </div>
              `
              : applications.map(application => `
                <div style="
                  background:white;
                  padding:20px;
                  margin-bottom:15px;
                  border-radius:14px;
                  border:1px solid #e5eaf1;
                ">

                  <h3 style="margin:0;color:#123b6d;">
                    Lamaran #${application.id}
                  </h3>
                  <p style="margin:6px 0;color:#334155;">
                  Perusahaan:
                  <strong>${application.jobs?.company_name || "Perusahaan"}</strong>
                  </p>

                  <p style="color:#64748b;">
                    Status:
                    <strong>
                      ${application.status || "Menunggu"}
                    </strong>
                  </p>

                  <p style="color:#64748b;">
                    Tanggal:
                    ${application.created_at || "-"}
                  </p>

                </div>
              `).join("")
          }

        </div>
      </div>
    `;

  document.body.innerHTML = "";
  document.body.appendChild(page);

   if (window.setLanguage) {
    window.setLanguage(localStorage.getItem("siteLanguage") || "id");
}
 
  } catch (error) {
  showNotification("jobsFailed", " " + error.message);
  }
}
// ================= UNDANGAN INTERVIEW =================

async function loadInterviewInvitations() {
  const userData = localStorage.getItem("kerjivaUser");
  const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    return;
  }

  try {
    const user = JSON.parse(userData);

    if (!user.id) {
      return;
    }

    const response = await fetch(
`${SUPABASE_URL}interviews?applicant_id=eq.${user.id}&select=id,company_id,interview_date,interview_time,status,created_at&order=interview_date.asc`,
  {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const interviews = await response.json();
    const language = localStorage.getItem("siteLanguage") || "id";

const interviewTitle =
  language === "en"
    ? "📅 Interview Invitations"
    : "📅 Undangan Interview";

const interviewFrom =
  language === "en"
    ? "Interview invitation from"
    : "Undangan interview dari";

const interviewDateLabel =
  language === "en"
    ? "Date:"
    : "Tanggal:";

const interviewTimeLabel =
  language === "en"
    ? "Time:"
    : "Jam:";

const interviewStatusLabel =
  language === "en"
    ? "Status:"
    : "Status:";
    const companyIds = [...new Set(
    interviews.map(interview => interview.company_id).filter(Boolean)
    )];

   let companies = [];

   if (companyIds.length > 0) {
   const companyResponse = await fetch(
    `${SUPABASE_URL}companies?id=in.(${companyIds.join(",")})&select=id,company_name`,
    {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!companyResponse.ok) {
    throw new Error(await companyResponse.text());
  }

  companies = await companyResponse.json();
}

    const dashboard = document.querySelector("#jobseekerDashboard");

    if (!dashboard) {
      return;
    }

    let interviewSection = document.querySelector("#interviewInvitationSection");

    if (!interviewSection) {
      interviewSection = document.createElement("div");
      interviewSection.id = "interviewInvitationSection";

      const contentArea = dashboard.querySelector(
        'div[style*="max-width:1100px"]'
      );

      if (contentArea) {
        contentArea.insertBefore(
          interviewSection,
          contentArea.firstElementChild
        );
      }
    }

    if (interviews.length === 0) {
      interviewSection.innerHTML = "";
      return;
    }

    interviewSection.innerHTML = `
      <div style="
        background:white;
        padding:25px;
        margin-bottom:25px;
        border-radius:16px;
        box-shadow:0 3px 15px rgba(15,23,42,.07);
        border:1px solid #e5eaf1;
      ">
     <h2 style="
         margin:0 0 18px;
         color:#172b4d;
         font-size:20px;
         ">
        ${interviewTitle}
        </h2>

        ${interviews.map(interview => `
          <div style="
            background:#f8fafc;
            padding:20px;
            margin-bottom:12px;
            border-radius:12px;
            border:1px solid #e5eaf1;
          ">

          <div style="
            font-size:17px;
            font-weight:bold;
            color:#123b6d;
            margin-bottom:10px;
          ">
            ${interviewFrom} ${
           companies.find(
           item => String(item.id) === String(interview.company_id)
           )?.company_name || "Perusahaan"
           }
           </div>

            <div style="
              color:#334155;
              margin-bottom:6px;
            ">
             📅 <strong>${interviewDateLabel}</strong>
              ${
               interview.interview_date
               ? new Date(interview.interview_date).toLocaleDateString("id-ID")
               : "-"
               }
            </div>

            <div style="
              color:#334155;
              margin-bottom:6px;
            ">
            🕐 <strong>${interviewTimeLabel}</strong>
              ${interview.interview_time || "-"}
            </div>

            <div style="
              color:#334155;
            ">
              📌 <strong>Status:</strong>
              ${interview.status || "pending"}
            </div>
            <button
               type="button"
               onclick="deleteInterview('${interview.id}')"
               style="
               margin-top:14px;
               padding:9px 14px;
               border:0;
               border-radius:8px;
               background:#dc2626;
               color:white;
               font-size:13px;
               font-weight:600;
               cursor:pointer;
               "
               >
               🗑 Hapus
               </button>

          </div>
        `).join("")}
      </div>
    `;

  } catch (error) {
    console.error("Gagal menampilkan undangan interview:", error);
  }
}

async function deleteInterview(interviewId) {

  const language = localStorage.getItem("siteLanguage") || "id";

  const confirmDelete = confirm(
    language === "en"
      ? "Delete this interview invitation?"
      : "Hapus undangan interview ini?"
  );

  if (!confirmDelete) return;

  try {

 const accessToken = localStorage.getItem("kerjivaAccessToken");

    if (!accessToken) {
      alert(
        language === "en"
          ? "Please login first."
          : "Silakan login terlebih dahulu."
      );
      return;
    }

    const response = await fetch(
      `${SUPABASE_URL}interviews?id=eq.${interviewId}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert(
      language === "en"
        ? "Interview invitation deleted."
        : "Undangan interview berhasil dihapus."
    );

    // Muat ulang dashboard
    showJobseekerDashboard();

  } catch (error) {

    console.error("Gagal menghapus interview:", error);

    alert(
      language === "en"
        ? "Failed to delete interview invitation."
        : "Gagal menghapus undangan interview."
    );
  }
}

function translateMyApplications(page) {

  page.innerHTML = page.innerHTML
    .replaceAll("Lamaran Saya", "My Applications")
    .replaceAll("Belum ada lamaran", "No applications yet")
    .replaceAll("Detail Lamaran", "Application Details")
    .replaceAll("Posisi", "Position")
    .replaceAll("Perusahaan", "Company")
    .replaceAll("Lokasi", "Location")
    .replaceAll("Tanggal Lamaran", "Application Date")
    .replaceAll("Status", "Status")
    .replaceAll("Menunggu", "Pending")
    .replaceAll("Diterima", "Accepted")
    .replaceAll("Ditolak", "Rejected")
   

  const language = localStorage.getItem("siteLanguage") || "id";

  const translations = {
    "Lamaran Saya": "My Applications",
    "← Dashboard": "← Dashboard",
    "Belum Ada Lamaran": "No Applications Yet",
    "Lamaran pekerjaan yang kamu kirim akan muncul di sini.": "The jobs you apply for will appear here.",
    "Status:": "Status:",
    "Tanggal:": "Date:",
    "Menunggu": "Pending"
  };

  page.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
      const text = element.textContent.trim();

      if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }
    }
  });
}
function translateMyJobs(page) {
  if (!page) return;

 const language = localStorage.getItem("siteLanguage") || "id";
  const translations = {
   "📋 Lowongan Saya": "📋 My Jobs",
    "Lowongan Saya": "My Jobs",
    "Daftar lowongan perusahaan Anda.": "Your company's job listings.",
    "Belum Ada Lowongan": "No Jobs Available",
    "Lowongan perusahaan akan muncul di sini.": "Your company's jobs will appear here."
  };

  page.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
      const text = element.textContent.trim();

      if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }

      if (language === "id") {
        const original = Object.keys(translations).find(
          key => translations[key] === text
        );

        if (original) {
          element.textContent = original;
        }
      }
    }
  });
}
 // ================= DASHBOARD PERUSAHAAN =================
window.submitJobPost = submitJobPost;

window.showCompanyDashboard = async function () {
  
    const activeRole =
    localStorage.getItem("kerjivaActiveRole");

  if (activeRole !== "company") {
    const isEnglish =
      localStorage.getItem("siteLanguage") === "en";

    alert(
      isEnglish
        ? "Please log out first, then log in as a Company."
        : "Silakan logout terlebih dahulu, lalu login sebagai Perusahaan."
    );

    return;
  }
  const dashboard = document.createElement("div");

  dashboard.id = "companyDashboard";
  const currentLanguage = localStorage.getItem("siteLanguage") || "id";
  dashboard.innerHTML = `
    <div style="
      min-height:100vh;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      color:#1f2937;
    ">

      <!-- HEADER -->
      <div style="
        background:#123b6d;
        color:white;
        padding:20px 30px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        box-shadow:0 3px 12px rgba(0,0,0,.15);
      ">
        <div>
       <img
         src="kerjiva.png"
         alt="Kerjiva"
         style="
         width:230px;
         height:auto;
         display:block;
         background:#fff;
         border-radius:6px;
         "
        >
        <div style="
         font-size:13px;
         opacity:.85;
         margin-top:4px;
         ">
         Dashboard Perusahaan
       </div>

          <div id="companyHeaderName" style="
          font-size:12px;
          opacity:.75;
          margin-top:3px;
         ">
        </div>
        </div>

        <button onclick="companyLogout()" style="
          background:rgba(255,255,255,.12);
          color:white;
          border:1px solid rgba(255,255,255,.3);
          padding:10px 18px;
          border-radius:8px;
          cursor:pointer;
          font-weight:bold;
        ">
          Logout
        </button>
      </div>

      <!-- CONTENT -->
      <div style="
        max-width:1100px;
        margin:auto;
        padding:35px 25px;
      ">

        <div style="margin-bottom:30px;">
          <h1 style="
            margin:0;
            font-size:30px;
            color:#172b4d;
          ">
           Selamat Datang 👋
          </h1>

          <p style="
            margin-top:8px;
            color:#64748b;
            font-size:16px;
          ">
            Kelola lowongan dan kebutuhan rekrutmen perusahaan Anda.
          </p>
        </div>

        <!-- STATISTIK -->
        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:18px;
          margin-bottom:30px;
        ">

          <div style="
            background:white;
            padding:22px;
            border-radius:14px;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              Total Lowongan
            </div>

          <div
             id="companyTotalJobs"
             style="
             font-size:30px;
             font-weight:bold;
             margin-top:8px;
             color:#123b6d;
             "
            >
              0
          </div>
          </div>

          <div style="
            background:white;
            padding:22px;
            border-radius:14px;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              Lowongan Aktif
            </div>

             <div
              id="companyActiveJobs"
              style="
              font-size:30px;
              font-weight:bold;
              margin-top:8px;
              color:#16805c;
              "
              >
                0
          </div>
          </div>

          <div style="
            background:white;
            padding:22px;
            border-radius:14px;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              Total Pelamar
            </div>

           <div
               id="companyTotalApplicants"
               style="
               font-size:30px;
               font-weight:bold;
               margin-top:8px;
               color:#7c3aed;
             "
             >
             0
          </div>
          </div>

          <div style="
            background:white;
            padding:22px;
            border-radius:14px;
            box-shadow:0 3px 12px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">
            <div style="font-size:13px;color:#64748b;">
              Lamaran Baru
            </div>

             <div
              id="companyNewApplications"
              style="
              font-size:30px;
              font-weight:bold;
              margin-top:8px;
              color:#ea580c;
               "
              >
              0
          </div>
          </div>

        </div>

        <!-- MENU -->
        <div style="
          background:white;
          padding:25px;
          border-radius:16px;
          box-shadow:0 3px 15px rgba(15,23,42,.07);
          border:1px solid #e5eaf1;
        ">

          <h2 style="
            margin-top:0;
            color:#172b4d;
            font-size:21px;
          ">
            Kelola Perusahaan
          </h2>

          <p style="
            color:#64748b;
            margin-bottom:22px;
          ">
            Pilih menu yang ingin Anda kelola.
          </p>

          <div style="
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
            gap:16px;
          ">

            <button onclick="showCompanyProfile()" style="
              padding:20px;
              background:#f8fafc;
              border:1px solid #dbe3ec;
              border-radius:12px;
              cursor:pointer;
              font-size:15px;
              font-weight:bold;
              color:#172b4d;
            ">
              🏢<br>
              <span style="display:inline-block;margin-top:8px;">
                Profil Perusahaan
              </span>
            </button>

            <button onclick="showPostJobForm()" style="
              padding:20px;
              background:#123b6d;
              border:none;
              border-radius:12px;
              cursor:pointer;
              font-size:15px;
              font-weight:bold;
              color:white;
              box-shadow:0 4px 10px rgba(18,59,109,.25);
            ">
              ➕<br>
              <span style="display:inline-block;margin-top:8px;">
                Pasang Lowongan
              </span>
            </button>

           <button onclick="showMyJobs()" style=" 
              padding:20px;
              background:#f8fafc;
              border:1px solid #dbe3ec;
              border-radius:12px;
              cursor:pointer;
              font-size:15px;
              font-weight:bold;
              color:#172b4d;
            ">
              📋<br>
              <span style="display:inline-block;margin-top:8px;">
                Lowongan Saya
              </span>
            </button>

            <button onclick="showIncomingApplications()" style="
  padding:20px;
  background:#f8fafc;
  border:1px solid #dbe3ec;
  border-radius:12px;
  cursor:pointer;
  font-size:15px;
  font-weight:bold;
  color:#172b4d;
">
  👥<br>
  <span style="display:inline-block;margin-top:8px;">
    Lamaran Masuk
  </span>
</button>

          </div>
        </div>

      </div>
    </div>
  `;

 document.body.innerHTML = "";
 document.body.appendChild(dashboard);
  
 translateCompanyDashboard();
  
const companyHeaderName = document.getElementById("companyHeaderName");
  const userDataHeader = localStorage.getItem("kerjivaUser");
  const accessTokenHeader = localStorage.getItem("kerjivaAccessToken");

if (companyHeaderName && userDataHeader && accessTokenHeader) {
  try {
    const companyUser = JSON.parse(userDataHeader);

    if (companyUser.id) {
      const response = await fetch(
        `${SUPABASE_URL}companies?user_id=eq.${companyUser.id}&select=company_name`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessTokenHeader}`
          }
        }
      );

      if (response.ok) {
        const companies = await response.json();

        if (companies.length > 0 && companies[0].company_name) {
          companyHeaderName.textContent = companies[0].company_name;
        }
      }
    }
  } catch (error) {
    console.error("Gagal mengambil nama perusahaan:", error);
  }
}
  const userData = localStorage.getItem("kerjivaUser");
  const accessToken = localStorage.getItem("kerjivaAccessToken");
  
    if (userData && accessToken) {
     try {
    const user = JSON.parse(userData);

    if (user.id) {
      const response = await fetch(
      `${SUPABASE_URL}jobs?user_id=eq.${user.id}&select=id,status`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const jobs = await response.json();
        const totalJobs = document.getElementById("companyTotalJobs");
        const totalApplicants = document.getElementById("companyTotalApplicants");
        const myJobIds = jobs.map(job => job.id);

       const applicationsResponse = await fetch(
         `${SUPABASE_APPLICATIONS_URL}?select=id,job_id,status,created_at`,
          {
          method: "GET",
          headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
          }
          }
          );

if (applicationsResponse.ok) {
  const applications = await applicationsResponse.json();

  const myApplications = applications.filter(
    app => myJobIds.includes(Number(app.job_id))
  );

  // Total Pelamar
  if (totalApplicants) {
    totalApplicants.textContent = myApplications.length;
  }

  // Lamaran Baru = lamaran dalam 1 bulan terakhir
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const newApplications = myApplications.filter(app => {
    if (!app.created_at) return false;

    return new Date(app.created_at) >= oneMonthAgo;
  });

  const newApplicationsElement =
    document.getElementById("companyNewApplications");

  if (newApplicationsElement) {
    newApplicationsElement.textContent = newApplications.length;
  }
}

if (totalJobs) {
  totalJobs.textContent = jobs.length;
}
        const activeJobs = jobs.filter(
  job => job.status === "published"
);

const activeJobsElement = document.getElementById("companyActiveJobs");

if (activeJobsElement) {
  activeJobsElement.textContent = activeJobs.length;
}
      }
    }
  } catch (error) {
    console.error("Gagal menghitung total lowongan:", error);
  }
}  
}

async function sendInterviewInvitation(userId) {
const date = document.getElementById("interviewDate").value;
const time = document.getElementById("interviewTime").value;

const displayDate = date
  ? date.split("-").reverse().join("-")
  : "";

 if (!date || !time) {
    alert(
    localStorage.getItem("siteLanguage") === "en"
      ? "Please select the interview date and time."
      : "Silakan pilih tanggal dan jam interview."
  );
  return;
}
  
const userData = localStorage.getItem("kerjivaUser");
const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
   showNotification("companySessionNotFound");
    return;
  }

  try {
    const company = JSON.parse(userData);

    const response = await fetch(
      `${SUPABASE_URL}interviews`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          applicant_id: userId,
          company_id: company.id,
          interview_date: date,
          interview_time: time,
          status: "pending"
        })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

  alert(
  localStorage.getItem("siteLanguage") === "en"
    ? "Interview invitation sent successfully.\n" +
     "Date: " + displayDate + "\n" +
     "Time: " + time
    : "Undangan interview berhasil dikirim.\n" +
      "Tanggal: " + displayDate + "\n" +
      "Jam: " + time
);

    document.querySelector('[style*=fixed]').remove();

  } catch (error) {
    console.error("Gagal mengirim undangan interview:", error);
    alert("Gagal mengirim undangan interview.");
  }
}
function openInterviewForm(userId) {
  const form = document.createElement("div");

  form.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.5);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
    ">
      <div style="
        background:white;
        width:90%;
        max-width:420px;
        padding:25px;
        border-radius:12px;
        box-shadow:0 10px 30px rgba(0,0,0,0.2);
      ">

      <div style="
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
">
 <h2 style="
  margin:0;
  color:#123b6d;
">
  ${
    localStorage.getItem("siteLanguage") === "en"
      ? "Invite to Interview"
      : "Undang Interview"
  }
   </h2>

  <button
    type="button"
    onclick="this.closest('[style*=fixed]').remove()"
    style="
      border:none;
      background:none;
      font-size:28px;
      font-weight:bold;
      color:#64748b;
      cursor:pointer;
      line-height:1;
    "
    aria-label="Tutup"
  >
    ×
  </button>
</div>

      <label style="font-weight:bold;">
      ${
      localStorage.getItem("siteLanguage") === "en"
      ? "Interview Date"
      : "Tanggal Interview"
      }
       </label>

        <input
          type="date"
          id="interviewDate"
          onchange="
            const d = new Date(this.value + 'T00:00:00');
            const days = [
              'Minggu','Senin','Selasa','Rabu',
              'Kamis','Jumat','Sabtu'
            ];
            document.getElementById('interviewDay').textContent =
              this.value ? days[d.getDay()] : '';
          "
          style="
            width:100%;
            padding:10px;
            margin:8px 0 5px;
            box-sizing:border-box;
            border:1px solid #cbd5e1;
            border-radius:8px;
          "
        >

        <div
          id="interviewDay"
          style="
            min-height:20px;
            margin-bottom:15px;
            color:#64748b;
            font-weight:bold;
          "
        ></div>

      <label style="font-weight:bold;">
      ${
      localStorage.getItem("siteLanguage") === "en"
      ? "Interview Time"
      : "Jam Interview"
      }
      </label>

        <input
          type="time"
          id="interviewTime"
          style="
            width:100%;
            padding:10px;
            margin:8px 0 20px;
            box-sizing:border-box;
            border:1px solid #cbd5e1;
            border-radius:8px;
          "
        >

        <button
          type="button"
          onclick="this.closest('[style*=fixed]').remove()"
          style="
            padding:10px 18px;
            border:none;
            border-radius:8px;
            background:#6b7280;
            color:white;
            cursor:pointer;
            margin-right:8px;
          "
        >
       ${
          localStorage.getItem("siteLanguage") === "en"
           ? "Cancel"
           : "Batal"
           }
        </button>

              <button
          type="button"
          onclick="sendInterviewInvitation('${userId}')"
          style="
            padding:10px 18px;
            border:none;
            border-radius:8px;
            background:#2563eb;
            color:white;
            cursor:pointer;
            font-weight:bold;
          "
        >
        ${
          localStorage.getItem("siteLanguage") === "en"
          ? "Send Invitation"
           : "Kirim Undangan"
          }
        </button>
        </div>
        </div>
        `;
          
  document.body.appendChild(form);
}

function confirmAcceptApplicant(userId) {
    const confirmAccept = confirm(
    localStorage.getItem("siteLanguage") === "en"
      ? "Are you sure you want to accept this applicant?"
      : "Apakah Anda yakin ingin menerima pelamar ini?"
  );

  if (!confirmAccept) {
    return;
  }

  alert(
    localStorage.getItem("siteLanguage") === "en"
      ? "Applicant accepted successfully."
      : "Pelamar berhasil diterima."
  );
}
  async function rejectApplicant(userId, jobId) {
  const confirmReject = confirm(
    
  localStorage.getItem("siteLanguage") === "en"
    ? "Are you sure you want to reject this applicant?"
    : "Apakah Anda yakin ingin menolak pelamar ini?"
);

  if (!confirmReject) {
    return;
  }

 const reason = prompt(
  localStorage.getItem("siteLanguage") === "en"
    ? "Enter the reason for rejecting the applicant:"
    : "Masukkan alasan penolakan pelamar:"
);

  if (reason === null) {
    return;
  }

 if (!reason.trim()) {
  alert(
    localStorage.getItem("siteLanguage") === "en"
      ? "Rejection reason is required."
      : "Alasan penolakan harus diisi."
  );
  return;
}

   const userData = localStorage.getItem("kerjivaUser");
   const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
   showNotification("companySessionNotFound");
    return;
  }

  try {
    const company = JSON.parse(userData);

  if (!company.id) {
  alert(
    localStorage.getItem("siteLanguage") === "en"
      ? "Company ID not found."
      : "ID perusahaan tidak ditemukan."
  );
  return;
}

    const response = await fetch(
   `${SUPABASE_URL}applications?user_id=eq.${userId}&job_id=eq.${jobId}&select=id,job_id,jobs(user_id)`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + accessToken
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const applications = await response.json();

  if (applications.length === 0) {
  alert(
    localStorage.getItem("siteLanguage") === "en"
      ? "Application data not found."
      : "Data lamaran tidak ditemukan."
  );
  return;
}

  const application = applications[0];

  if (!application) {
  alert(
    localStorage.getItem("siteLanguage") === "en"
      ? "This application does not belong to your company's job listing."
      : "Lamaran ini bukan milik lowongan perusahaan Anda."
  );
  return;
}

    const updateResponse = await fetch(
      `${SUPABASE_URL}applications?id=eq.${application.id}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: reason.trim()
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error(await updateResponse.text());
    }

 alert(
  localStorage.getItem("siteLanguage") === "en"
    ? "Applicant rejected successfully."
    : "Pelamar berhasil ditolak."
);

  } catch (error) {
    console.error("Gagal menolak pelamar:", error);
  alert(
    
  localStorage.getItem("siteLanguage") === "en"
    ? "Failed to reject applicant."
    : "Gagal menolak pelamar."
);
  }
}
// ================= PROFIL PERUSAHAAN =================

window.showCompanyProfile = async function () {
const userData = localStorage.getItem("kerjivaUser");
const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
  showNotification("companySessionNotFound");
    return;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
    showNotification("invalidAccount");
    return;
  }

 if (!user.id) {
  showNotification("userIdNotFound");
}

  try {
    const response = await fetch(
      `${SUPABASE_URL}companies?user_id=eq.${user.id}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

  const companies = await response.json();

  const company = companies[0] || {
  id: null,
  user_id: user.id,
  company_name: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  address: ""
};
    const profile = document.createElement("div");

    profile.id = "companyProfile";
    if (!company.id) {
  profile.innerHTML = `
    <div style="
      min-height:100vh;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      color:#1f2937;
    ">

      <div style="
        background:#123b6d;
        color:white;
        padding:20px 30px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">
        <div>
          <div style="
            font-size:24px;
            font-weight:bold;
          ">
            <span id="newCompanyProfileBrand">Kerjiva</span>
          </div>

          <div style="
            font-size:13px;
            opacity:.85;
            margin-top:4px;
          ">
            Profil Perusahaan
          </div>
        </div>

        <button
          onclick="showCompanyDashboard()"
          style="
            background:rgba(255,255,255,.12);
            color:white;
            border:1px solid rgba(255,255,255,.3);
            padding:10px 18px;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
          "
        >
          ← Dashboard
        </button>
      </div>

      <div style="
        max-width:900px;
        margin:auto;
        padding:35px 25px;
      ">

        <div style="
          background:white;
          padding:30px;
          border-radius:16px;
          border:1px solid #e5eaf1;
          box-shadow:0 3px 15px rgba(15,23,42,.07);
        ">

          <h1 style="
            margin:0 0 25px 0;
            color:#172b4d;
            font-size:28px;
          ">
            ${
              localStorage.getItem("siteLanguage") === "en"
                ? "Company Profile"
                : "Profil Perusahaan"
            }
          </h1>

          <label style="font-weight:bold;">
            ${
              localStorage.getItem("siteLanguage") === "en"
                ? "Company Name"
                : "Nama Perusahaan"
            }
          </label>

          <input
            id="editCompanyName"
            placeholder="${
              localStorage.getItem("siteLanguage") === "en"
                ? "Company Name"
                : "Nama Perusahaan"
            }"
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              margin:7px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              font-size:15px;
            "
          >

          <label style="font-weight:bold;">📧 Email</label>

          <input
            value="${company.email || user.email || ""}"
            disabled
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              margin:7px 0 18px;
              border:1px solid #e5eaf1;
              border-radius:8px;
              font-size:15px;
              background:#f1f5f9;
            "
          >

          <label style="font-weight:bold;">📞 ${
            localStorage.getItem("siteLanguage") === "en"
              ? "Phone"
              : "Telepon"
          }</label>

          <input
            id="editCompanyPhone"
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              margin:7px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              font-size:15px;
            "
          >

          <label style="font-weight:bold;">🌐 ${
            localStorage.getItem("siteLanguage") === "en"
              ? "Website"
              : "Website"
          }</label>

          <input
            id="editCompanyWebsite"
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              margin:7px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              font-size:15px;
            "
          >

          <label style="font-weight:bold;">📍 ${
            localStorage.getItem("siteLanguage") === "en"
              ? "City"
              : "Kota"
          }</label>

          <input
            id="editCompanyCity"
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              margin:7px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              font-size:15px;
            "
          >

          <label style="font-weight:bold;">🏠 ${
            localStorage.getItem("siteLanguage") === "en"
              ? "Address"
              : "Alamat"
          }</label>

          <textarea
            id="editCompanyAddress"
            rows="4"
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              margin:7px 0 25px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              font-size:15px;
              resize:vertical;
            "
          ></textarea>

          <button
            onclick="saveCompanyProfile(null)"
            style="
              padding:12px 22px;
              background:#123b6d;
              color:white;
              border:none;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            💾 ${
              localStorage.getItem("siteLanguage") === "en"
                ? "Save Profile"
                : "Simpan Profil"
            }
          </button>

        </div>
      </div>
    </div>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(profile);

  if (window.setLanguage) {
    window.setLanguage(
      localStorage.getItem("siteLanguage") || "id"
    );
  }

  return;
}

    profile.innerHTML = `
      <div style="
        min-height:100vh;
        background:#f4f7fb;
        font-family:Arial,sans-serif;
        color:#1f2937;
      ">

        <!-- HEADER -->
        <div style="
          background:#123b6d;
          color:white;
          padding:20px 30px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          box-shadow:0 3px 12px rgba(0,0,0,.15);
        ">
          <div>
            <div style="
             font-size:24px;
             font-weight:bold;
             ">
            <span id="companyProfileBrand">Kerjiva</span>
             </div>

            <div style="
              font-size:13px;
              opacity:.85;
              margin-top:4px;
            ">
              Profil Perusahaan
            </div>
          </div>

          <button
            onclick="showCompanyDashboard()"
            style="
              background:rgba(255,255,255,.12);
              color:white;
              border:1px solid rgba(255,255,255,.3);
              padding:10px 18px;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            ← Dashboard
          </button>
        </div>

        <!-- CONTENT -->
        <div style="
          max-width:900px;
          margin:auto;
          padding:35px 25px;
        ">

          <div style="
            background:white;
            padding:30px;
            border-radius:16px;
            box-shadow:0 3px 15px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">

            <div style="
              width:80px;
              height:80px;
              border-radius:50%;
              background:#eaf1f8;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:38px;
              margin-bottom:20px;
            ">
              🏢
            </div>

            <h1 style="
              margin:0;
              color:#172b4d;
              font-size:28px;
            ">
              ${company.company_name || "Nama Perusahaan"}
            </h1>

            <p style="
              color:#64748b;
              margin-top:8px;
            ">
              Profil perusahaan Anda
            </p>
            ${
  company.id
    ? `
     <div style="
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:15px;
">

  <button
    onclick="editCompanyProfile()"
    style="
      padding:12px 20px;
      background:#123b6d;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    ✏️ ${
      localStorage.getItem("siteLanguage") === "en"
        ? "Edit Profile"
        : "Edit Profil"
    }
  </button>

  <button
    onclick="deleteCompanyProfile('${company.id}')"
    style="
      padding:12px 20px;
      background:#dc2626;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    🗑️ ${
      localStorage.getItem("siteLanguage") === "en"
        ? "Delete Profile"
        : "Hapus Profil"
    }
  </button>

</div>
    `
    : `
      <button
        onclick="saveCompanyProfile(null)"
        style="
          padding:12px 20px;
          background:#123b6d;
          color:white;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-weight:bold;
          margin-top:15px;
        "
      >
        💾 ${
          localStorage.getItem("siteLanguage") === "en"
            ? "Save Profile"
            : "Simpan Profil"
        }
      </button>
    `
}

            <div style="
              display:grid;
              gap:14px;
              margin-top:25px;
            ">

              <div style="
                padding:16px;
                background:#f8fafc;
                border-radius:10px;
                border:1px solid #e5eaf1;
              ">
                <strong>📧 Email</strong>
                <div style="margin-top:5px;color:#64748b;">
                  ${company.email || "-"}
                </div>
              </div>

              <div style="
                padding:16px;
                background:#f8fafc;
                border-radius:10px;
                border:1px solid #e5eaf1;
              ">
                <strong>📞 Telepon</strong>
                <div style="margin-top:5px;color:#64748b;">
                  ${company.phone || "-"}
                </div>
              </div>

              <div style="
                padding:16px;
                background:#f8fafc;
                border-radius:10px;
                border:1px solid #e5eaf1;
              ">
                <strong>🌐 Website</strong>
                <div style="margin-top:5px;color:#64748b;">
                  ${company.website || "-"}
                </div>
              </div>

              <div style="
                padding:16px;
                background:#f8fafc;
                border-radius:10px;
                border:1px solid #e5eaf1;
              ">
                <strong>📍 Kota</strong>
                <div style="margin-top:5px;color:#64748b;">
                  ${company.city || "-"}
                </div>
                </div>

              <div style="
                padding:16px;
                background:#f8fafc;
                border-radius:10px;
                border:1px solid #e5eaf1;
              ">
                <strong>🏠 Alamat</strong>
                <div style="margin-top:5px;color:#64748b;">
                  ${company.address || "-"}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    `;

  document.body.innerHTML = "";
  document.body.appendChild(profile);
  translateCompanyProfile(profile);

if (window.setLanguage) {
  window.setLanguage(localStorage.getItem("siteLanguage") || "id");

  const companyProfileBrand = document.getElementById("companyProfileBrand");

 if (companyProfileBrand) {
  companyProfileBrand.textContent = "Kerjiva";
}
}

  } catch (error) {
    showNotification("companyProfileFailed", " " + error.message);
  }
}
// ================= EDIT PROFIL PERUSAHAAN =================

async function editCompanyProfile() {
const userData = localStorage.getItem("kerjivaUser");
const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
  showNotification("invalidAccount");
    return;
  }

  if (!user.id) {
  showNotification("userIdNotFound");
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}companies?user_id=eq.${user.id}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const companies = await response.json();

    if (!companies.length) {
      showNotification("profileNotFound");
      return;
    }

    const company = companies[0];

    const profile = document.getElementById("companyProfile");

    if (!profile) return;

    profile.innerHTML = `
      <div style="
        min-height:100vh;
        background:#f4f7fb;
        font-family:Arial,sans-serif;
        color:#1f2937;
      ">

        <div style="
          background:#123b6d;
          color:white;
          padding:20px 30px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          box-shadow:0 3px 12px rgba(0,0,0,.15);
        ">
          <div>
          <div style="
              font-size:24px;
              font-weight:bold;
              ">
             <span id="editCompanyBrand">Kerjiva</span>
            </div>

            <div style="
              font-size:13px;
              opacity:.85;
              margin-top:4px;
            ">
              Edit Profil Perusahaan
            </div>
          </div>

          <button
            onclick="showCompanyProfile()"
            style="
              background:rgba(255,255,255,.12);
              color:white;
              border:1px solid rgba(255,255,255,.3);
              padding:10px 18px;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            ← Batal
          </button>
        </div>

        <div style="
          max-width:900px;
          margin:auto;
          padding:35px 25px;
        ">

          <div style="
            background:white;
            padding:30px;
            border-radius:16px;
            box-shadow:0 3px 15px rgba(15,23,42,.07);
            border:1px solid #e5eaf1;
          ">

            <h1 style="
              margin:0 0 25px 0;
              color:#172b4d;
              font-size:28px;
            ">
              Edit Profil Perusahaan
            </h1>

            <label>Nama Perusahaan</label>
            <input
              id="editCompanyName"
              value="${company.company_name || ""}"
              style="
                width:100%;
                box-sizing:border-box;
                padding:13px;
                margin:7px 0 18px;
                border:1px solid #dbe3ec;
                border-radius:8px;
                font-size:15px;
              "
            >

            <label>📧 Email</label>
            <input
              value="${company.email || ""}"
              disabled
              style="
                width:100%;
                box-sizing:border-box;
                padding:13px;
                margin:7px 0 18px;
                border:1px solid #e5eaf1;
                border-radius:8px;
                font-size:15px;
                background:#f1f5f9;
              "
            >

            <label>📞 Telepon</label>
            <input
              id="editCompanyPhone"
              value="${company.phone || ""}"
              style="
                width:100%;
                box-sizing:border-box;
                padding:13px;
                margin:7px 0 18px;
                border:1px solid #dbe3ec;
                border-radius:8px;
                font-size:15px;
              "
            >

            <label>Website</label>
            <input
              id="editCompanyWebsite"
              value="${company.website || ""}"
              style="
                width:100%;
                box-sizing:border-box;
                padding:13px;
                margin:7px 0 18px;
                border:1px solid #dbe3ec;
                border-radius:8px;
                font-size:15px;
              "
            >

            <label>📍 Kota</label>
            <input
              id="editCompanyCity"
              value="${company.city || ""}"
              style="
                width:100%;
                box-sizing:border-box;
                padding:13px;
                margin:7px 0 18px;
                border:1px solid #dbe3ec;
                border-radius:8px;
                font-size:15px;
              "
            >

            <label>Alamat</label>
            <textarea
              id="editCompanyAddress"
              rows="4"
              style="
                width:100%;
                box-sizing:border-box;
                padding:13px;
                margin:7px 0 25px;
                border:1px solid #dbe3ec;
                border-radius:8px;
                font-size:15px;
                resize:vertical;
              "
            >${company.address || ""}</textarea>

            <div style="
              display:flex;
              gap:12px;
              flex-wrap:wrap;
            ">

              <button
                onclick="saveCompanyProfile('${company.id}')"
                style="
                  padding:12px 22px;
                  background:#123b6d;
                  color:white;
                  border:none;
                  border-radius:8px;
                  cursor:pointer;
                  font-weight:bold;
                "
              >
                💾 Simpan
              </button>

              <button
                onclick="showCompanyProfile()"
                style="
                  padding:12px 22px;
                  background:#e2e8f0;
                  color:#172b4d;
                  border:none;
                  border-radius:8px;
                  cursor:pointer;
                  font-weight:bold;
                "
              >
                Batal
              </button>

            </div>

          </div>
        </div>
      </div>
    `;

   if (window.setLanguage) {
  window.setLanguage(localStorage.getItem("siteLanguage") || "id");

  const editCompanyBrand = document.getElementById("editCompanyBrand");

 if (editCompanyBrand) {
  editCompanyBrand.textContent = "Kerjiva";
}
}

  } catch (error) {
    showNotification("companyProfileFailed", " " + error.message);
  }
}


// ================= SIMPAN PROFIL PERUSAHAAN =================

async function saveCompanyProfile(companyId) {

 const userData = localStorage.getItem("kerjivaUser");
 const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const companyName =
    document.getElementById("editCompanyName")?.value.trim();

  const phone =
    document.getElementById("editCompanyPhone")?.value.trim();

  const website =
    document.getElementById("editCompanyWebsite")?.value.trim();

  const city =
    document.getElementById("editCompanyCity")?.value.trim();

  const address =
    document.getElementById("editCompanyAddress")?.value.trim();

  if (!companyName) {
    alert("Nama perusahaan wajib diisi.");
    return;
  }

  try {

const user = JSON.parse(userData);

console.log("COMPANY ID YANG DIUPDATE:", companyId);
console.log("USER DATA:", userData);

const response = await fetch(
  companyId
    ? `${SUPABASE_URL}companies?id=eq.${companyId}&user_id=eq.${user.id}`
    : `${SUPABASE_URL}companies`,
  {
    method: companyId ? "PATCH" : "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      user_id: user.id,
      company_name: companyName,
      email: user.email || "",
      phone: phone,
      website: website,
      city: city,
      address: address
    })
  }
);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
      const language = localStorage.getItem("siteLanguage") || "id";

      alert(
      language === "en"
    ? "Company profile updated successfully."
    : "Profil perusahaan berhasil diperbarui."
     );

    await showCompanyProfile();

  } catch (error) {

    console.error("Gagal menyimpan profil perusahaan:", error);

    showNotification(
      "companyProfileFailed",
      " " + error.message
    );
  }
}
async function deleteCompanyProfile(companyId) {
  const userData = localStorage.getItem("kerjivaUser");
  const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const language =
    localStorage.getItem("siteLanguage") || "id";

  const confirmed = confirm(
    language === "en"
      ? "Are you sure you want to delete your company profile?"
      : "Yakin ingin menghapus profil perusahaan?"
  );

  if (!confirmed) return;

  try {
    const user = JSON.parse(userData);

    const response = await fetch(
      `${SUPABASE_URL}companies?id=eq.${companyId}&user_id=eq.${user.id}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          Prefer: "return=minimal"
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert(
      language === "en"
        ? "Company profile deleted successfully."
        : "Profil perusahaan berhasil dihapus."
    );

    await showCompanyProfile();

  } catch (error) {
    console.error(
      "Gagal menghapus profil perusahaan:",
      error
    );

    showNotification(
      "companyProfileFailed",
      " " + error.message
    );
  }
}

// ================= LOWONGAN SAYA =================

window.showMyJobs = async function () {
  const userData = localStorage.getItem("kerjivaUser");
  const accessToken = localStorage.getItem("kerjivaAccessToken");
  
  if (!userData || !accessToken) {
  showNotification("companySessionNotFound");
    return;
  }

  let user;

  try {
    user = JSON.parse(userData);
    
  } catch {
  showNotification("invalidAccount");
    return;
  }

  if (!user.id) {
   showNotification("userIdNotFound");
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}jobs?user_id=eq.${user.id}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const jobs = await response.json();

    const page = document.createElement("div");

    page.innerHTML = `
      <div style="
        min-height:100vh;
        background:#f4f7fb;
        font-family:Arial,sans-serif;
        color:#1f2937;
      ">

        <div style="
          background:#123b6d;
          color:white;
          padding:20px 30px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
        <div>
        <div id="myJobsBrand" style="
         font-size:24px;
         font-weight:bold;
         ">
         Kerjiva
         </div>

            <div style="
              font-size:13px;
              opacity:.85;
              margin-top:4px;
            ">
             Lowongan Saya
            </div>
          </div>

          <button
            onclick="showCompanyDashboard()"
            style="
              background:rgba(255,255,255,.12);
              color:white;
              border:1px solid rgba(255,255,255,.3);
              padding:10px 18px;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            ← Dashboard
          </button>
        </div>

        <div style="
          max-width:1000px;
          margin:auto;
          padding:35px 25px;
        ">

          <h1 style="
            margin:0;
            color:#172b4d;
            font-size:30px;
          ">
            📋 Lowongan Saya
          </h1>

          <p style="
            color:#64748b;
            margin-top:8px;
            margin-bottom:25px;
          ">
            Daftar lowongan perusahaan Anda.
          </p>

          ${
            jobs.length === 0
              ? `
                <div style="
                  background:white;
                  padding:45px 25px;
                  border-radius:16px;
                  text-align:center;
                  border:1px solid #e5eaf1;
                ">
                  <div style="font-size:50px;">📋</div>

                  <h2 style="color:#172b4d;">
                    Belum Ada Lowongan
                  </h2>

                  <p style="color:#64748b;">
                    Lowongan perusahaan akan muncul di sini.
                  </p>
                </div>
              `
             : jobs.map(job => {

    const language = localStorage.getItem("siteLanguage") || "id";

    const displayTitle =
      language === "en"
        ? (job.title_en || job.title || "Untitled Job")
        : (job.title || "Tanpa Judul");

    const displayDescription =
      language === "en"
        ? (job.description_en || job.description || "-")
        : (job.description || "-");

    return `
      <div style="
        background:white;
        padding:22px;
        margin-bottom:16px;
        border-radius:14px;
        border:1px solid #e5eaf1;
      ">

        <h2 style="
          margin:0;
          color:#123b6d;
        ">
          ${displayTitle}
        </h2>

        <div style="
          margin-top:10px;
          color:#64748b;
        ">
          📍 ${job.city || "-"}
        </div>

        <p style="
          margin-top:14px;
          color:#475569;
        ">
          ${displayDescription}
        </p>

        <div style="
          display:flex;
          gap:10px;
          margin-top:18px;
          flex-wrap:wrap;
        ">

          <button
            onclick="editMyJob('${job.id}')"
            style="
              padding:10px 18px;
              background:#123b6d;
              color:white;
              border:none;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            ✏️ Edit
          </button>

          ${
            job.status === "draft"
              ? `
                <button
                  onclick="publishMyJob('${job.id}')"
                  style="
                    padding:10px 18px;
                    background:#16805c;
                    color:white;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                    font-weight:bold;
                  "
                >
                  🚀 Kirim
                </button>
              `
              : ""
          }

          <button
            onclick="deleteMyJob('${job.id}')"
            style="
              padding:10px 18px;
              background:#dc2626;
              color:white;
              border:none;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            🗑️ Hapus
          </button>

        </div>
      </div>
    `;
  }).join("")
          }

        </div>
      </div>
    `;

    document.body.innerHTML = "";
    document.body.appendChild(page);
    translateMyJobs(page);

   if (window.setLanguage) {
       window.setLanguage(localStorage.getItem("siteLanguage") || "id");

   const myJobsBrand = document.getElementById("myJobsBrand");

if (myJobsBrand) {
  myJobsBrand.textContent = "Kerjiva";
}
}
  } catch (error) {
    showNotification("jobsFailed", " " + error.message);
  }
}

async function publishMyJob(jobId) {
  const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const language = localStorage.getItem("siteLanguage") || "id";

  const confirmPublish = confirm(
    language === "en"
    ? "Are you sure you want to submit this job posting and display it on Kerjiva?"
    : "Yakin ingin mengirim lowongan ini agar tampil di Kerjiva?"
  );

  if (!confirmPublish) return;

  try {
    const response = await fetch(
      `${SUPABASE_URL}jobs?id=eq.${jobId}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          status: "published"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    showNotification("jobPublished");

    await showMyJobs();

  } catch (error) {
    console.error("Gagal mengirim lowongan:", error);

  showNotification("jobsFailed");
  }
}

window.publishMyJob = publishMyJob;
async function editMyJob(jobId) {
  const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}jobs?id=eq.${jobId}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const jobs = await response.json();

    if (!jobs.length) {
      alert("Lowongan tidak ditemukan.");
      return;
    }

    const job = jobs[0];

    const form = document.createElement("div");

    form.innerHTML = `
      <div id="editJobFormContainer" style="
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.65);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:9999;
        padding:20px;
        overflow-y:auto;
      ">
        <div style="
          background:#fff;
          padding:28px;
          border-radius:18px;
          width:100%;
          max-width:620px;
          box-shadow:0 20px 50px rgba(0,0,0,.2);
          margin:auto;
        ">

          <h2 style="
            margin:0 0 6px;
            font-size:26px;
            color:#123b6d;
          ">
            Edit Lowongan
          </h2>

          <p style="
            margin:0 0 22px;
            color:#64748b;
            font-size:14px;
          ">
            Perbarui informasi pekerjaan Anda.
          </p>

          <label>Judul / Posisi Pekerjaan</label>
          <input
            id="editJobTitle"
            value="${job.title || ""}"
            placeholder="Contoh: Staff Administrasi"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
          >

          <label>Kategori Pekerjaan</label>
          <select
            id="editJobCategory"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;background:white;"
          >
            <option value="">Pilih kategori</option>
            <option value="Administrasi">Administrasi</option>
            <option value="Accounting">Accounting</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="IT">IT</option>
            <option value="Teknologi">Teknologi</option>
            <option value="HRD">HRD</option>
            <option value="Desain">Desain</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Logistik">Logistik</option>
            <option value="Produksi">Produksi</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Retail">Retail</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <label>Lokasi / Kota</label>
          <input
            id="editJobCity"
            value="${job.city || ""}"
            placeholder="Contoh: Jakarta"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
          >

          <label>Jenis Pekerjaan</label>
          <select
            id="editJobType"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;background:white;"
          >
            <option value="">Pilih jenis pekerjaan</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
          </select>

          <label>Gaji</label>
          <input
            id="editJobSalary"
            value="${job.salary || ""}"
            placeholder="Contoh: Rp 5.000.000 - Rp 7.000.000 / bulan"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
          >

          <label>Pengalaman Kerja</label>
          <input
            id="editJobExperience"
            value="${job.experience || ""}"
            placeholder="Contoh: Minimal 1 tahun"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
          >

          <label>Pendidikan Minimal</label>
          <input
            id="editJobEducation"
            value="${job.education || ""}"
            placeholder="Contoh: SMA / SMK / D3 / S1"
            style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
          >

          <label>Deskripsi Pekerjaan</label>
          <textarea
            id="editJobDescription"
            placeholder="Jelaskan pekerjaan dan tanggung jawabnya..."
            style="width:100%;box-sizing:border-box;height:100px;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;resize:vertical;"
          >${job.description || ""}</textarea>

          <label>Syarat / Kualifikasi</label>
          <textarea
            id="editJobRequirements"
            placeholder="Tuliskan persyaratan kandidat..."
            style="width:100%;box-sizing:border-box;height:100px;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;resize:vertical;"
          >${job.requirements || ""}</textarea>

          <label>Batas Lamaran</label>
          <input
            id="editJobDeadline"
            type="date"
            value="${job.application_deadline || ""}"
            style="width:100%;box-sizing:border-box;margin:7px 0 20px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
          >

          <div style="display:flex;flex-direction:column;gap:10px;">

            <button
              onclick="saveEditedJob('${job.id}')"
              style="
                width:100%;
                padding:13px;
                border:0;
                border-radius:10px;
                background:#123b6d;
                color:white;
                font-weight:bold;
                cursor:pointer;
              "
            >
              Simpan Perubahan
            </button>

            <button
              onclick="document.getElementById('editJobFormContainer')?.remove()"
              style="
                width:100%;
                padding:13px;
                border:1px solid #dbe2ea;
                border-radius:10px;
                background:white;
                cursor:pointer;
              "
            >
              Batal
            </button>

          </div>

        </div>
      </div>
    `;

    document.body.appendChild(form);

    // Set nilai select sesuai data database
    document.getElementById("editJobCategory").value =
      job.category || "";

    document.getElementById("editJobType").value =
      job.job_type || "";
  
    translateEditJobForm(form);

  } catch (error) {
    alert("Gagal membuka edit lowongan: " + error.message);
  }
}

async function saveEditedJob(jobId) {
  const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const title =
    document.getElementById("editJobTitle").value.trim();

  const category =
    document.getElementById("editJobCategory").value;

  const city =
    document.getElementById("editJobCity").value.trim();

  const jobType =
    document.getElementById("editJobType").value;

  const salary =
    document.getElementById("editJobSalary").value.trim();

  const experience =
    document.getElementById("editJobExperience").value.trim();

  const education =
    document.getElementById("editJobEducation").value.trim();

  const description =
    document.getElementById("editJobDescription").value.trim();

  const requirements =
    document.getElementById("editJobRequirements").value.trim();

  const applicationDeadline =
    document.getElementById("editJobDeadline").value;

  if (!title || !city || !description) {
    showNotification("jobRequired");
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}jobs?id=eq.${jobId}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          title,
          category,
          city,
          job_type: jobType,
          salary,
          experience,
          education,
          description,
          requirements,
          application_deadline: applicationDeadline || null
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert(
      localStorage.getItem("siteLanguage") === "en"
        ? "Job updated successfully."
        : "Lowongan berhasil diperbarui."
    );

    document.getElementById("editJobFormContainer")?.remove();

    showMyJobs();

  } catch (error) {
    alert("Gagal menyimpan perubahan: " + error.message);
  }
}

window.editMyJob = editMyJob;
window.saveEditedJob = saveEditedJob;

async function deleteMyJob(jobId) {
 const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const language = localStorage.getItem("siteLanguage") || "id";

  const confirmDelete = confirm(
    language === "en"
      ? "Are you sure you want to delete this job posting?"
      : "Yakin ingin menghapus lowongan ini?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `${SUPABASE_URL}jobs?id=eq.${jobId}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert(
      language === "en"
        ? "Job posting deleted successfully."
        : "Lowongan berhasil dihapus."
    );

    await showMyJobs();

  } catch (error) {
    console.error("Gagal menghapus lowongan:", error);

    alert(
      language === "en"
        ? "Failed to delete the job posting."
        : "Gagal menghapus lowongan."
    );
  }
}

window.deleteMyJob = deleteMyJob;
function translateEditJobForm(form) {
  if (!form) return;

  const language = localStorage.getItem("siteLanguage") || "id";

  const translations = {
    "Edit Lowongan": "Edit Job",
    "Perbarui informasi pekerjaan Anda.": "Update your job information.",
    "Judul / Posisi Pekerjaan": "Job Title / Position",
    "Kategori Pekerjaan": "Job Category",
    "Pilih kategori": "Select category",
    "Lokasi / Kota": "Location / City",
    "Jenis Pekerjaan": "Job Type",
    "Pilih jenis pekerjaan": "Select job type",
    "Gaji": "Salary",
    "Pengalaman Kerja": "Work Experience",
    "Pendidikan Minimal": "Minimum Education",
    "Deskripsi Pekerjaan": "Job Description",
    "Syarat / Kualifikasi": "Requirements / Qualifications",
    "Batas Lamaran": "Application Deadline",
    "Simpan Perubahan": "Save Changes",
    "Batal": "Cancel"
  };

  const placeholders = {
    "Contoh: Staff Administrasi": "Example: Administrative Staff",
    "Contoh: Jakarta": "Example: Jakarta",
    "Contoh: Rp 5.000.000 - Rp 7.000.000 / bulan":
      "Example: Rp 5,000,000 - Rp 7,000,000 / month",
    "Contoh: Minimal 1 tahun":
      "Example: At least 1 year",
    "Contoh: SMA / SMK / D3 / S1":
      "Example: High School / Diploma / Bachelor's",
    "Jelaskan pekerjaan dan tanggung jawabnya...":
      "Describe the job and responsibilities...",
    "Tuliskan persyaratan kandidat...":
      "Enter candidate requirements..."
  };

  form.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
      const text = element.textContent.trim();

      if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }

      if (language === "id") {
        const original = Object.keys(translations).find(
          key => translations[key] === text
        );

        if (original) {
          element.textContent = original;
        }
      }
    }
  });

  form.querySelectorAll("input, textarea").forEach(element => {
    const placeholder = element.getAttribute("placeholder");

    if (!placeholder) return;

    if (language === "en" && placeholders[placeholder]) {
      element.setAttribute(
        "placeholder",
        placeholders[placeholder]
      );
    }

    if (language === "id") {
      const original = Object.keys(placeholders).find(
        key => placeholders[key] === placeholder
      );

      if (original) {
        element.setAttribute(
          "placeholder",
          original
        );
      }
    }
  });

  form.querySelectorAll("option").forEach(option => {
    const text = option.textContent.trim();

    const optionTranslations = {
      "Pilih kategori": "Select category",
      "Administrasi": "Administration",
      "Teknologi": "Technology",
      "Kesehatan": "Healthcare",
      "Pendidikan": "Education",
      "Kuliner": "Culinary",
      "Lainnya": "Other"
    };

    if (language === "en" && optionTranslations[text]) {
      option.textContent = optionTranslations[text];
    }

    if (language === "id") {
      const original = Object.keys(optionTranslations).find(
        key => optionTranslations[key] === text
      );

      if (original) {
        option.textContent = original;
      }
    }
  });
}

function translateMyJobs(page) {
  if (!page) return;

  const language = "id";

  const translations = {
    "📋 Lowongan Saya": "📋 My Jobs",
    "Daftar lowongan perusahaan Anda.": "Your company's job listings.",
    "Belum Ada Lowongan": "No Jobs Available",
    "Lowongan perusahaan akan muncul di sini.": "Your company's jobs will appear here."
  };

  page.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
      const text = element.textContent.trim();

      if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }
    }
  });
}

function companyLogout() {
  localStorage.removeItem("kerjivaUser");
  localStorage.removeItem("kerjivaAccessToken");
  localStorage.removeItem("kerjivaActiveRole");
  location.reload();
}

function showPostJobForm() {
   const userData = localStorage.getItem("kerjivaUser");
   const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const form = document.createElement("div");

  form.innerHTML = `
  <div id="postJobFormContainer" style="
      position:fixed;
      inset:0;
      background:rgba(15,23,42,.65);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
      padding:20px;
      overflow-y:auto;
    ">
      <div style="
        background:#fff;
        padding:28px;
        border-radius:18px;
        width:100%;
        max-width:620px;
        box-shadow:0 20px 50px rgba(0,0,0,.2);
        margin:auto;
      ">

        <h2 style="
          margin:0 0 6px;
          font-size:26px;
          color:#123b6d;
        ">Pasang Lowongan</h2>

        <p style="
          margin:0 0 22px;
          color:#64748b;
          font-size:14px;
        ">
          Lengkapi informasi pekerjaan yang ingin Anda tawarkan.
        </p>

        <label>Judul / Posisi Pekerjaan</label>
        <input
          id="jobTitle"
          placeholder="Contoh: Staff Administrasi"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
        >

        <label>Kategori Pekerjaan</label>
        <select
          id="jobCategory"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;background:white;"
        >
          <option value="">Pilih kategori</option>
          <option>Administrasi</option>
          <option>Accounting</option>
          <option>Finance</option>
          <option>Marketing</option>
          <option>Sales</option>
          <option>IT</option>
          <option>Teknologi</option>
          <option>HRD</option>
          <option>Desain</option>
          <option>Customer Service</option>
          <option>Logistik</option>
          <option>Produksi</option>
          <option>Kesehatan</option>
          <option>Pendidikan</option>
          <option>Kuliner</option>
          <option>Retail</option>
          <option>Lainnya</option>
        </select>

        <label>Lokasi / Kota</label>
        <input
          id="jobCity"
          placeholder="Contoh: Jakarta"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
        >

        <label>Jenis Pekerjaan</label>
        <select
          id="jobType"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;background:white;"
        >
          <option value="">Pilih jenis pekerjaan</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>

        <label>Gaji</label>
        <input
          id="jobSalary"
          placeholder="Contoh: Rp 5.000.000 - Rp 7.000.000 / bulan"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
        >

        <label>Pengalaman Kerja</label>
        <input
          id="jobExperience"
          placeholder="Contoh: Minimal 1 tahun"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
        >

        <label>Pendidikan Minimal</label>
        <input
          id="jobEducation"
          placeholder="Contoh: SMA / SMK / D3 / S1"
          style="width:100%;box-sizing:border-box;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
        >

        <label>Deskripsi Pekerjaan</label>
        <textarea
          id="jobDescription"
          placeholder="Jelaskan pekerjaan dan tanggung jawabnya..."
          style="width:100%;box-sizing:border-box;height:100px;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;resize:vertical;"
        ></textarea>

        <label>Syarat / Kualifikasi</label>
        <textarea
          id="jobRequirements"
          placeholder="Tuliskan persyaratan kandidat..."
          style="width:100%;box-sizing:border-box;height:100px;margin:7px 0 15px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;resize:vertical;"
        ></textarea>

        <label>Batas Lamaran</label>
        <input
          id="jobDeadline"
          type="date"
          style="width:100%;box-sizing:border-box;margin:7px 0 20px;padding:12px;border:1px solid #dbe2ea;border-radius:10px;"
        >

      <div style="display:flex;flex-direction:column;gap:10px;">
      <button
      onclick="submitJobPost()"
      style="
      width:100%;
      padding:13px;
      border:0;
      border-radius:10px;
      background:#123b6d;
      color:white;
      font-weight:bold;
      cursor:pointer;
    "
  >
    Simpan Lowongan
  </button>

  <button
    onclick="publishNewJob()"
    style="
      width:100%;
      padding:13px;
      border:0;
      border-radius:10px;
      background:#16805c;
      color:white;
      font-weight:bold;
      cursor:pointer;
    "
  >
    🚀 Kirim Lowongan
  </button>

  <button
    onclick="this.closest('div[style*=fixed]').remove()"
    style="
      width:100%;
      padding:13px;
      border:1px solid #dbe2ea;
      border-radius:10px;
      background:white;
      cursor:pointer;
    "
  >
    Batal
  </button>

</div>
        </div>

      </div>
    </div>
  `;

document.body.appendChild(form);
translatePostJobForm(form);

if (window.setLanguage) {
  window.setLanguage(localStorage.getItem("siteLanguage") || "id");
}
}

async function publishNewJob() {
  const title = document.getElementById("jobTitle").value.trim();
  const city = document.getElementById("jobCity").value.trim();
  const description = document.getElementById("jobDescription").value.trim();
  const category = document.getElementById("jobCategory").value;
  const jobType = document.getElementById("jobType").value;
  const salary = document.getElementById("jobSalary").value.trim();
  const experience = document.getElementById("jobExperience").value.trim();
  const education = document.getElementById("jobEducation").value.trim();
  const applicationDeadline = document.getElementById("jobDeadline").value;
  const requirements = document.getElementById("jobRequirements").value.trim();

  if (!title || !city || !description) {
  showNotification("jobRequired");
    return;
  }

 const userData = localStorage.getItem("kerjivaUser");
 const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const user = JSON.parse(userData);
  // =====================================================
// AMBIL NAMA PERUSAHAAN DARI PROFIL PERUSAHAAN
// =====================================================

const companyResponse = await fetch(
 `${SUPABASE_URL}companies?id=eq.${user.id}&select=company_name`,
  {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  }
);

if (!companyResponse.ok) {
  throw new Error("Gagal mengambil profil perusahaan.");
}

const companyData = await companyResponse.json();

const companyName =
  companyData[0]?.company_name?.trim() || "";

if (!companyName) {
  throw new Error(
    "Nama perusahaan belum tersedia di Profil Perusahaan."
  );
}

  const language = localStorage.getItem("siteLanguage") || "id";

  const confirmPublish = confirm(
  language === "en"
   ? "Are you sure you want to submit this job posting and display it on Kerjiva?"
   : "Apakah Anda yakin ingin mengirim lowongan ini dan menampilkannya di Kerjiva?"
   );

  if (!confirmPublish) return;

  try {
    const response = await fetch(
      "https://ksqrimmecpriyepsuclc.supabase.co/rest/v1/jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "apikey": SUPABASE_KEY,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          title,
          city,
          description,
          user_id: user.id,
          company_name: companyName,
          category,
          job_type: jobType,
          salary,
          experience,
          education,
          application_deadline: applicationDeadline || null,
          requirements,
          status: "published"
        })
      }
    );

   const result = await response.json();

if (!response.ok) {
  throw new Error(
    result.message || result.error || "Gagal mengirim lowongan."
  );
}

// =====================================================
// TERJEMAHAN ENGLISH — SATU KALI SAAT LOWONGAN DIBUAT
// Hasil disimpan permanen di tabel jobs
// =====================================================

try {
  const newJob = Array.isArray(result)
    ? result[0]
    : result;

  if (newJob?.id) {

    const translationResponse = await fetch(
      "https://ksqrimmecpriyepsuclc.supabase.co/functions/v1/translate-job",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY
        },
        body: JSON.stringify({
          jobs: [
            {
              id: newJob.id,
              title: newJob.title || title,
              company:
                newJob.company ||
                newJob.company_name ||
                "Perusahaan",
              location:
                newJob.city ||
                city,
              type:
                newJob.job_type ||
                jobType,
              category:
                newJob.category ||
                category,
              salary:
                newJob.salary ||
                salary,
              description:
                newJob.description ||
                description,
              requirements:
                newJob.requirements ||
                requirements
            }
          ]
        })
      }
    );

    const translationResult =
      await translationResponse.json();

    if (
      translationResponse.ok &&
      translationResult?.success &&
      Array.isArray(translationResult.jobs) &&
      translationResult.jobs[0]
    ) {

      const translated =
        translationResult.jobs[0];

          const saveTranslationResponse = await fetch(
        `${SUPABASE_URL}jobs?id=eq.${newJob.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "apikey": SUPABASE_KEY,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            title_en:
              translated.title_en ||
              translated.title ||
              null,

            description_en:
              translated.description_en ||
              translated.description ||
              null,

            requirements_en:
              translated.requirements_en ||
              translated.requirements ||
              null,

            job_type_en:
              translated.job_type_en ||
              translated.type ||
              null,

            category_en:
              translated.category_en ||
              translated.category ||
              null,

            salary_en:
              translated.salary_en ||
              translated.salary ||
              null,

            experience_en:
              translated.experience_en ||
              translated.experience ||
              null,

            education_en:
              translated.education_en ||
              translated.education ||
              null
          })
        }
      );

      if (!saveTranslationResponse.ok) {
        const saveError =
          await saveTranslationResponse.text();

        throw new Error(
          `Gagal menyimpan terjemahan ke database: ${saveError}`
        );
      }

      console.log(
        "Terjemahan English berhasil disimpan ke database:",
        newJob.id
      );
    } else {

      console.warn(
        "Terjemahan English gagal. Lowongan tetap tersimpan.",
        translationResult
      );

    }

  }

} catch (translationError) {

  console.warn(
    "Gagal menyimpan terjemahan English:",
    translationError
  );

}

alert(
  language === "en"
    ? "✅ Job posting has been submitted and is now live on Kerjiva."
    : "✅ Lowongan berhasil dikirim dan sudah tampil di Kerjiva."
);

    document
      .getElementById("postJobFormContainer")
      ?.remove();

    showMyJobs();

  } catch (error) {
    alert("Gagal mengirim lowongan: " + error.message);
  }
}
async function submitJobPost() {
  const title = document.getElementById("jobTitle").value.trim();
  const city = document.getElementById("jobCity").value.trim();
  const description = document.getElementById("jobDescription").value.trim();
  const category = document.getElementById("jobCategory").value;
  const jobType = document.getElementById("jobType").value;
  const salary = document.getElementById("jobSalary").value.trim();
  const experience = document.getElementById("jobExperience").value.trim();
  const education = document.getElementById("jobEducation").value.trim();
  const applicationDeadline = document.getElementById("jobDeadline").value;
  const requirements = document.getElementById("jobRequirements").value.trim();

  if (!title || !city || !description) {
     showNotification("jobRequired");
    return;
  }

    const userData = localStorage.getItem("kerjivaUser");
    const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const user = JSON.parse(userData);

  try {
    const response = await fetch(
      "https://ksqrimmecpriyepsuclc.supabase.co/rest/v1/jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "apikey": SUPABASE_KEY,
          "Prefer": "return=representation"
        },
     body: JSON.stringify({
  title,
  city,
  description,
  user_id: user.id,
  category,
  job_type: jobType,
  salary,
  experience,
  education,
  application_deadline: applicationDeadline || null,
  requirements,
  status: "draft",
      })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || result.error || "Gagal menyimpan lowongan."
      );
    }

        showNotification("jobDraftSaved");

    showMyJobs();

    } catch (error) {
      showNotification(
     "jobsFailed",
      " " + error.message
    );
  }
}
function translateCompanyDashboard() {
  const dashboard = document.getElementById("companyDashboard");
  if (!dashboard) return;

const language = localStorage.getItem("siteLanguage") || "id";

 const translations = {
  "Tentang": "About",
  "Kontak": "Contact",
  "Masuk": "Login",
  "MASUK": "LOGIN", 
  "Masuk akun Anda": "Log in to your account",
  "Login berhasil": "Login successful",
   
  "Daftar": "Register",
  "Cari Kerja": "Find a Job",
  "Cari": "Search",
  "Lowongan": "Jobs",
  "Perusahaan": "Companies",
  "Profil": "Profile",
  "Keluar": "Logout",

  "Dashboard Perusahaan": "Company Dashboard",
  "Selamat Datang 👋": "Welcome 👋",
  "Kelola lowongan dan kebutuhan rekrutmen perusahaan Anda.": "Manage your job openings and recruitment needs.",
  "Total Lowongan": "Total Jobs",
  "Lowongan Aktif": "Active Jobs",
  "Total Pelamar": "Total Applicants",
  "Lamaran Baru": "New Applications",
  "Kelola Perusahaan": "Manage Company",
  "Pilih menu yang ingin Anda kelola.": "Choose a menu to manage.",
  "Profil Perusahaan": "Company Profile",
  "Pasang Lowongan": "Post a Job",
  "Lowongan Saya": "My Jobs",
  "Lamaran Masuk": "Incoming Applications",

  "Belum Ada Lowongan": "No Jobs Available",
  "Belum ada lowongan nyata yang tersedia untuk pencarian ini.": "There are no real job openings available for this search.",
  "Silakan coba jenis pekerjaan atau kota lainnya.": "Please try another job type or city.",

  "Kembali": "Back",
  "Simpan": "Save",
  "Batal": "Cancel",
  "Edit": "Edit",
  "Hapus": "Delete",
  "Lihat": "View",
  "Lamar": "Apply",
  "Cari Lowongan": "Search Jobs",
  "Jenis Pekerjaan": "Job Type",
  "Kota": "City",
  "Semua Kota": "All Cities",
  "Semua Jenis Pekerjaan": "All Job Types"
};

  dashboard.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
   const text = element.textContent.trim();

if (text === "Kerjiva") {
  element.textContent = "Kerjiva";
  return;
}

if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }

      if (language === "id") {
        const original = Object.keys(translations).find(
          key => translations[key] === text
        );
        if (original) element.textContent = original;
      }
    }
  });
}         

function translateCompanyProfile(profile) {
  if (!profile) return;

 const language = localStorage.getItem("siteLanguage") || "id";

const translations = {
  "Profil Perusahaan": "Company Profile",
  "Profil perusahaan Anda": "Your company profile",
  "Nama Perusahaan": "Company Name",
  "📧 Email": "📧 Email",
  "📞 Telepon": "📞 Phone",
  "🌐 Website": "🌐 Website",
  "📍 Kota": "📍 City",
  "🏠 Alamat": "🏠 Address",
  "Deskripsi": "Description",
  "Simpan Profil": "Save Profile",
  "Kembali": "Back"
};

 profile.querySelectorAll("*").forEach(element => {
  if (element.children.length === 0) {
    const text = element.textContent.trim();

    if (language === "id") {
      const original = Object.keys(translations).find(
        key => translations[key] === text
      );

      if (original) {
        element.textContent = original;
      }
    }
  }
});
}

function translatePostJobForm(form) {
  if (!form) return;

 const language = localStorage.getItem("siteLanguage") || "id";

  const translations = {
    "Pasang Lowongan": "Post a Job",
    "Lengkapi informasi pekerjaan yang ingin Anda tawarkan.": "Complete the job information you want to offer.",
    "Judul / Posisi Pekerjaan": "Job Title / Position",
    "Kategori Pekerjaan": "Job Category",
    "Pilih kategori": "Select category",
    "Lokasi / Kota": "Location / City",
    "Jenis Pekerjaan": "Job Type",
    "Pilih jenis pekerjaan": "Select job type",
    "Gaji": "Salary",
    "Pengalaman Kerja": "Work Experience",
    "Pendidikan Minimal": "Minimum Education",
    "Deskripsi Pekerjaan": "Job Description",
    "Syarat / Kualifikasi": "Requirements / Qualifications",
    "Batas Lamaran": "Application Deadline",
    "Simpan Lowongan": "Save Job",
    "Batal": "Cancel"
  };

  const placeholders = {
    "Contoh: Staff Administrasi": "Example: Administrative Staff",
    "Contoh: Jakarta": "Example: Jakarta",
    "Contoh: Rp 5.000.000 - Rp 7.000.000 / bulan": "Example: Rp 5,000,000 - Rp 7,000,000 / month",
    "Contoh: Minimal 1 tahun": "Example: At least 1 year",
    "Contoh: SMA / SMK / D3 / S1": "Example: High School / Diploma / Bachelor's",
    "Jelaskan pekerjaan dan tanggung jawabnya...": "Describe the job and responsibilities...",
    "Tuliskan persyaratan kandidat...": "Enter candidate requirements..."
  };

  form.querySelectorAll("*").forEach(element => {
    if (element.children.length === 0) {
    const text = element.textContent.trim();

 if (text === "Kerjiva") {
  element.textContent = "Kerjiva";
  return;
}
   if (language === "en" && translations[text]) {
        element.textContent = translations[text];
      }

      if (language === "id") {
        const original = Object.keys(translations).find(
          key => translations[key] === text
        );
        if (original) element.textContent = original;
      }
    }
  });

  form.querySelectorAll("input, textarea").forEach(element => {
    const placeholder = element.getAttribute("placeholder");
    if (!placeholder) return;

    if (language === "en" && placeholders[placeholder]) {
      element.setAttribute("placeholder", placeholders[placeholder]);
    }

    if (language === "id") {
      const original = Object.keys(placeholders).find(
        key => placeholders[key] === placeholder
      );
      if (original) element.setAttribute("placeholder", original);
    }
  });

  form.querySelectorAll("option").forEach(option => {
    const text = option.textContent.trim();

    const optionTranslations = {
      "Administrasi": "Administration",
      "Pilih kategori": "Select category",
      "Teknologi": "Technology",
      "Kesehatan": "Healthcare",
      "Pendidikan": "Education",
      "Kuliner": "Culinary",
      "Lainnya": "Other"
    };

    if (language === "en" && optionTranslations[text]) {
      option.textContent = optionTranslations[text];
    }

    if (language === "id") {
      const original = Object.keys(optionTranslations).find(
        key => optionTranslations[key] === text
      );
      if (original) option.textContent = original;
    }
  });
}
loadJobsFromDatabase();

const menuBtn = document.querySelector("#menuBtn");
const mainMenu = document.querySelector("#mainMenu");
document.addEventListener("click", (e) => {
  if (
    mainMenu &&
    menuBtn &&
    !mainMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    mainMenu.style.display = "none";
  }
});

if (menuBtn && mainMenu) {

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  mainMenu.style.display =
    mainMenu.style.display === "none" ? "block" : "none";
});
  }
  
  // Tutup menu setelah salah satu item menu diklik
  
   if (mainMenu) {
      mainMenu.addEventListener("click", () => {
      mainMenu.style.display = "none";
     });
   }

function setupAuthButtons() {

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const closeModal = document.getElementById("closeModal");
  const authModal = document.getElementById("authModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const authForm = document.getElementById("authForm");

 


  if (closeModal) {

    closeModal.addEventListener("click", () => {

      if (authModal) {
        authModal.classList.add("hidden");
      }

    });

  }

}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    setupAuthButtons
  );

} else {

  setupAuthButtons();

}
  // =====================================================
// HANDOFF DARI LOGIN.HTML
// LENGKAPI PROFIL PERUSAHAAN
// =====================================================

if (
  localStorage.getItem(
    "kerjivaCompleteCompanyProfile"
  ) === "true"
) {

  localStorage.removeItem(
    "kerjivaCompleteCompanyProfile"
  );

  setTimeout(() => {

    if (
      typeof showCompanyRegistrationAfterLogin ===
      "function"
    ) {
      showCompanyRegistrationAfterLogin();
    }

  }, 300);

}
  
window.showIncomingApplications = async function () {
 const userData = localStorage.getItem("kerjivaUser");
 const accessToken = localStorage.getItem("kerjivaAccessToken");
  if (!userData || !accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  const currentUser = JSON.parse(userData);

  try {

    // =====================================================
    // AMBIL DATA LAMARAN
    // =====================================================
    const response = await fetch(
      `${SUPABASE_APPLICATIONS_URL}?select=*,jobs(title,user_id)&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const applications = await response.json();


    // =====================================================
    // FILTER HANYA LAMARAN UNTUK LOWONGAN PERUSAHAAN INI
    // =====================================================
    const myApplications = applications.filter(
      app => app.jobs && app.jobs.user_id === currentUser.id
    );


    // =====================================================
    // AMBIL PROFILE PENCARI KERJA
    // =====================================================
  
for (const app of myApplications) {

 const profileResponse = await fetch(
  `${SUPABASE_URL}jobseeker_profiles?id=eq.${app.user_id}&select=id,full_name,phone,city,education,experience,skills,photo_url`,
  {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  }
);

  console.log("USER ID PELAMAR:", app.user_id);

  if (profileResponse.ok) {

    const profiles = await profileResponse.json();

    console.log("HASIL PROFILE:", profiles);

    app.jobseeker = profiles[0] || null;

  } else {

    console.error(
      "Gagal mengambil profile pelamar:",
      await profileResponse.text()
    );

    app.jobseeker = null;
  }
}
    


    // =====================================================
    // BUAT HALAMAN LAMARAN MASUK
    // =====================================================
    const dashboard = document.createElement("div");

    dashboard.style.cssText = `
      min-height:100vh;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      padding:30px;
      color:#172b4d;
    `;


    dashboard.innerHTML = `
      <div style="max-width:1100px;margin:auto;">

        <button
          onclick="showCompanyDashboard()"
          style="
            padding:10px 18px;
            border:none;
            border-radius:8px;
            background:#123b6d;
            color:white;
            cursor:pointer;
            font-weight:bold;
            margin-bottom:25px;
          "
        >
        ← ${localStorage.getItem("siteLanguage") === "en" ? "Back" : "Kembali"}
        </button>


     <h1>
  ${
    myApplications.length === 0
      ? (localStorage.getItem("siteLanguage") === "en"
          ? "No incoming applications."
          : "Belum ada lamaran masuk.")
      : (localStorage.getItem("siteLanguage") === "en"
          ? "Incoming Applications"
          : "Lamaran Masuk")
  }
</h1>

<p style="color:#64748b;">
  ${
    localStorage.getItem("siteLanguage") === "en"
      ? `${myApplications.length} incoming applications`
      : `${myApplications.length} lamaran masuk`
  }
</p>


        ${
          myApplications.length === 0

            ? `

             <div style="
               background:white;
               padding:30px;
               border-radius:14px;
               border:1px solid #e5eaf1;
               ">

                ${
               localStorage.getItem("siteLanguage") === "en"
                ? "No incoming applications yet."
                : "Belum ada lamaran masuk."
                }

               </div>
            `

            : myApplications.map(app => `

              <div
                  onclick="showApplicantDetail('${app.user_id}', '${app.job_id}', '${app.id}')"
                style="
                  background:white;
                  padding:22px;
                  margin-bottom:15px;
                  border-radius:14px;
                  border:1px solid #e5eaf1;
                  box-shadow:0 3px 12px rgba(15,23,42,.07);
                  cursor:pointer;
                  transition:0.2s;
                "
                onmouseover="this.style.transform='translateY(-2px)'"
                onmouseout="this.style.transform='translateY(0)'"
              >

                <h3 style="margin-top:0;">
                  ${app.jobs?.title || "Lowongan"}
                </h3>


                <p>
                  <strong>${localStorage.getItem("siteLanguage") === "en" ? "Applicant:" : "Pelamar:"}</strong>
                  ${
                    app.jobseeker?.full_name ||
                    "Nama pelamar belum tersedia"
                  }
                </p>


                <p>
                  <strong>Status:</strong>
                  ${app.status || "submitted"}
                </p>


                <p style="color:#64748b;">
                ${localStorage.getItem("siteLanguage") === "en" ? "Submitted:" : "Dikirim:"}
                  ${
                    app.created_at
                      ? new Date(app.created_at).toLocaleString("id-ID")
                      : "-"
                  }
                </p>


                <div style="
                  margin-top:15px;
                  color:#123b6d;
                  font-weight:bold;
                ">
               ${localStorage.getItem("siteLanguage") === "en"
                ? "View Applicant Profile →"
                : "Lihat Profil Pelamar →"}
                </div>

              </div>

            `).join("")
        }

      </div>
    `;


    document.body.innerHTML = "";

    document.body.appendChild(dashboard);


  } catch (error) {

    console.error("Gagal mengambil lamaran:", error);

    alert("Gagal mengambil data lamaran.");

  }
}

// ================= DETAIL PROFIL PELAMAR =================

  async function showApplicantDetail(userId, jobId, applicationId) {
    const accessToken = localStorage.getItem("kerjivaAccessToken");

  if (!accessToken) {
   showNotification("companySessionNotFound");
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}jobseeker_profiles?id=eq.${userId}&select=id,full_name,phone,city,education,experience,skills,photo_url`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const profiles = await response.json();
    const profile = profiles[0];
    
    // AMBIL DOKUMEN YANG DIPILIH UNTUK LAMARAN INI
    const documentsResponse = await fetch(
  `${SUPABASE_URL}application_documents?application_id=eq.${applicationId}&select=document_id,jobseeker_documents(id,document_name,document_type,file_path,created_at)`,
  {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  }
);

if (!documentsResponse.ok) {
  throw new Error(await documentsResponse.text());
}

const applicationDocuments = await documentsResponse.json();

console.log(
  "DOKUMEN TERPILIH UNTUK LAMARAN:",
  applicationDocuments
);

    if (!profile) {
      alert("Profil pelamar belum tersedia.");
      return;
    }

    const dashboard = document.createElement("div");

    dashboard.style.cssText = `
      min-height:100vh;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      padding:30px;
      color:#172b4d;
    `;

    const photoHTML = profile.photo_url
      ? `
        <img
          src="${profile.photo_url}"
          alt="Foto ${profile.full_name || "Pelamar"}"
          style="
            width:130px;
            height:130px;
            object-fit:cover;
            border-radius:50%;
            border:4px solid #dbe3ec;
          "
        >
      `
      : `
        <div style="
          width:130px;
          height:130px;
          border-radius:50%;
          background:#e8eef6;
          margin:auto;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:60px;
          border:4px solid #dbe3ec;
        ">
          👤
        </div>
      `;

   dashboard.innerHTML = `
  <div style="max-width:850px;margin:auto;">

    <button
      type="button"
      onclick="showIncomingApplications()"
      style="
        padding:10px 18px;
        border:none;
        border-radius:8px;
        background:#123b6d;
        color:white;
        cursor:pointer;
        font-weight:bold;
        margin-bottom:25px;
      "
    >
        ${
         localStorage.getItem("siteLanguage") === "en"
        ? "← Back to Incoming Applications"
        : "← Kembali ke Lamaran Masuk"
        }
    </button>

    <div style="
      background:white;
      padding:30px;
      border-radius:16px;
      border:1px solid #e5eaf1;
      box-shadow:0 3px 15px rgba(15,23,42,.07);
    ">

      <h1 style="
        margin-top:0;
        text-align:center;
        color:#172b4d;
      ">
       ${localStorage.getItem("siteLanguage") === "en" ? "Applicant Profile" : "Profil Pelamar"}
      </h1>

      <!-- IDENTITAS UTAMA -->
      <div style="
        text-align:center;
        margin:25px 0 30px;
      ">

        ${photoHTML}

        <h2 style="margin:15px 0 5px;">
          ${profile.full_name || "Nama belum tersedia"}
        </h2>

        <p style="color:#64748b;margin:0;">
          ${profile.city || "Domisili belum tersedia"}
        </p>

      </div>

      <!-- DROPDOWN DETAIL PROFIL -->
      <details style="
        border:1px solid #e5eaf1;
        border-radius:10px;
        margin-bottom:15px;
        overflow:hidden;
      ">

        <summary style="
          padding:16px 18px;
          cursor:pointer;
          font-weight:bold;
          color:#123b6d;
          background:#f8fafc;
        ">
         ▼ ${localStorage.getItem("siteLanguage") === "en" ? "Applicant Profile Details" : "Detail Profil Pelamar"}
        </summary>

        <div style="padding:20px;">

        <p>
          <strong>
          ${
          localStorage.getItem("siteLanguage") === "en"
          ? "Phone Number"
          : "Nomor Telepon"
          }
          </strong><br>
          ${profile.phone || "Belum tersedia"}
          </p>

          <p>
          <strong>${localStorage.getItem("siteLanguage") === "en" ? "City / Location" : "Kota / Domisili"}</strong>
            ${profile.city || "Belum tersedia"}
          </p>

           <p>
           <strong>
            ${
            localStorage.getItem("siteLanguage") === "en"
            ? "Education"
            : "Pendidikan"
            }
            </strong><br>
             ${profile.education || "Belum tersedia"}
            </p>
             <p>
             <strong>
              ${
              localStorage.getItem("siteLanguage") === "en"
               ? "Work Experience"
               : "Pengalaman Kerja"
                }
             </strong><br>
              ${profile.experience || "Belum tersedia"}
            </p>

          <p style="margin-bottom:0;">
          <strong>${localStorage.getItem("siteLanguage") === "en" ? "Skills" : "Keahlian"}</strong>
            ${profile.skills || "Belum tersedia"}
          </p>

        </div>

      </details>
      <!-- DOKUMEN LAMARAN -->
<details style="
  border:1px solid #e5eaf1;
  border-radius:10px;
  margin-bottom:15px;
  overflow:hidden;
">

  <summary style="
    padding:16px 18px;
    cursor:pointer;
    font-weight:bold;
    color:#123b6d;
    background:#f8fafc;
  ">
    ▼ ${
      localStorage.getItem("siteLanguage") === "en"
        ? "Application Documents"
        : "Dokumen Lamaran"
    }
  </summary>

  <div style="padding:20px;">

    ${
      applicationDocuments.length === 0
        ? `
          <p style="
            color:#64748b;
            margin:0;
          ">
            ${
              localStorage.getItem("siteLanguage") === "en"
                ? "No documents were attached to this application."
                : "Tidak ada dokumen yang dilampirkan pada lamaran ini."
            }
          </p>
        `
        : applicationDocuments.map(item => `
            <div style="
              padding:14px;
              margin-bottom:10px;
              border:1px solid #e5eaf1;
              border-radius:8px;
              background:#f8fafc;
            ">

              <strong>
                📄 ${item.jobseeker_documents?.document_name || "Dokumen"}
              </strong>

              <div style="
                margin-top:5px;
                color:#64748b;
                font-size:13px;
              ">
                ${
                  item.jobseeker_documents?.document_type || ""
                }
              </div>
              <button
  type="button"
  onclick="viewApplicantDocument(
    '${item.jobseeker_documents?.file_path || ""}',
    '${(item.jobseeker_documents?.document_name || "Dokumen").replace(/'/g, "\\'")}'
  )"
  style="
    margin-top:10px;
    padding:8px 14px;
    border:none;
    border-radius:6px;
    background:#123b6d;
    color:white;
    cursor:pointer;
    font-weight:bold;
  "
>
  ${
    localStorage.getItem("siteLanguage") === "en"
      ? "View Document"
      : "Lihat Dokumen"
  }
</button>

            </div>
          `).join("")
    }

  </div>

</details>

      <!-- DROPDOWN TINDAKAN PERUSAHAAN -->
      <details style="
        border:1px solid #e5eaf1;
        border-radius:10px;
        overflow:hidden;
      ">

        <summary style="
          padding:16px 18px;
          cursor:pointer;
          font-weight:bold;
          color:#123b6d;
          background:#f8fafc;
        ">
        ▼ ${localStorage.getItem("siteLanguage") === "en" ? "Company Actions" : "Tindakan Perusahaan"}
        </summary>

        <div style="padding:20px;">

         <button
    type="button"
    onclick="window.open('https://wa.me/${(profile.phone || '').replace(/^0/, '62').replace(/[^0-9]/g, '')}', '_blank')"
    style="
    width:100%;
    padding:12px;
    margin-bottom:10px;
    border:none;
    border-radius:8px;
    background:#123b6d;
    color:white;
    cursor:pointer;
    font-weight:bold;
    "
    >
   ${
  localStorage.getItem("siteLanguage") === "en"
    ? "Contact Applicant"
    : "Hubungi Pelamar"
    }
          </button>
  <button
  type="button"
  onclick="openInterviewForm('${userId}')"
  style="
    width:100%;
    padding:12px;
    margin-bottom:10px;
    border:none;
    border-radius:8px;
    background:#2563eb;
    color:white;
    cursor:pointer;
    font-weight:bold;
  "
>
  ${
    localStorage.getItem("siteLanguage") === "en"
      ? "Invite to Interview"
      : "Undang Interview"
  }
       </button>

        <button
  type="button"
  onclick="confirmAcceptApplicant('${userId}')"
  style="
    width:100%;
    padding:12px;
    margin-bottom:10px;
    border:none;
    border-radius:8px;
    background:#16a34a;
    color:white;
    cursor:pointer;
    font-weight:bold;
    "
    >
  ${
  localStorage.getItem("siteLanguage") === "en"
    ? "Accept Applicant"
    : "Terima Pelamar"
    }
         </button>

         <button
  type="button"
  onclick="rejectApplicant('${userId}', '${jobId}')"
  style="
    width:100%;
    padding:12px;
    border:none;
    border-radius:8px;
    background:#dc2626;
    color:white;
    cursor:pointer;
    font-weight:bold;
  "
>
${localStorage.getItem("siteLanguage") === "en" ? "Reject Applicant" : "Tolak Pelamar"}
</button>
        </div>

      </details>

    </div>

  </div>
`;
  document.body.innerHTML = "";
  document.body.appendChild(dashboard);


  } catch (error) {

    console.error("Gagal mengambil detail profil pelamar:", error);

   showNotification("applicationLoadFailed");
  }
}
async function viewApplicantDocument(filePath, documentName) {
  console.log("FILE PATH YANG DIMINTA:", filePath);
const accessToken = localStorage.getItem("kerjivaAccessToken");
  if (!accessToken) {
    showNotification("companySessionNotFound");
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL.replace("/rest/v1/", "/")}storage/v1/object/sign/jobseeker-documents`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({
      paths: [filePath],
      expiresIn: 300
      })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    const signedUrl =
      data[0]?.signedURL ||
      data[0]?.signedUrl ||
      data[0]?.signed_url;

    if (!signedUrl) {
      throw new Error("Signed URL tidak ditemukan.");
      }

 const finalUrl = signedUrl.startsWith("http")
     ? signedUrl
     : `${SUPABASE_URL.replace("/rest/v1/", "/")}storage/v1${signedUrl}`;

     window.open(finalUrl, "_blank");

  } catch (error) {
    console.error("Gagal membuka dokumen:", error);

    const language =
      localStorage.getItem("siteLanguage") || "id";

    alert(
      language === "en"
        ? "Failed to open the document."
        : "Gagal membuka dokumen."
    );
  }
}

// ================= PROFIL DIRI PENCARI KERJA =================

  window.showJobseekerProfile = async function () {
  const userData = localStorage.getItem("kerjivaUser");
  const language = localStorage.getItem("siteLanguage") || "id";
  const accessToken = localStorage.getItem("kerjivaAccessToken");
  if (!userData) {
    alert(
      language === "en"
        ? "Please log in first."
        : "Silakan login terlebih dahulu."
    );
    return;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    alert(
      language === "en"
        ? "Invalid account data. Please log in again."
        : "Data akun tidak valid. Silakan login kembali."
    );
    return;
  }

  const dashboard = document.createElement("div");

  dashboard.id = "jobseekerProfile";

  dashboard.innerHTML = `
    <div style="
      min-height:100vh;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      color:#1f2937;
    ">

      <div style="
        background:#123b6d;
        color:white;
        padding:20px 30px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        box-shadow:0 3px 12px rgba(0,0,0,.15);
      ">

          <div>
          <div style="
            font-size:24px;
            font-weight:bold;
          ">
         Kerjiva
          </div>

          <div style="
            font-size:13px;
            opacity:.85;
            margin-top:4px;
          ">
            ${language === "en" ? "My Profile" : "Profil Diri"}
          </div>
        </div>

        <button
          type="button"
          onclick="showJobseekerDashboard()"
          style="
            background:white;
            color:#123b6d;
            border:none;
            padding:10px 18px;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
          "
        >
          ← ${language === "en" ? "Back" : "Kembali"}
        </button>

      </div>

      <div style="
        max-width:850px;
        margin:auto;
        padding:35px 25px;
      ">

        <div style="
          background:white;
          padding:30px;
          border-radius:16px;
          box-shadow:0 3px 15px rgba(15,23,42,.07);
          border:1px solid #e5eaf1;
        ">

          <h1 style="
            margin-top:0;
            color:#172b4d;
            font-size:26px;
          ">
            👤 ${language === "en" ? "My Profile" : "Profil Diri"}
          </h1>

          <div style="
            text-align:center;
            margin:25px 0 30px;
          ">

          <div
  id="jobseekerProfilePhoto"
  style="
    width:120px;
    height:120px;
    border-radius:50%;
    background:#e8eef6;
    margin:auto;
    display:flex;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    border:4px solid #dbe3ec;
  "
>
  👤
</div>

           <input
  id="jobseekerPhotoInput"
  type="file"
  accept="image/*"
  style="display:none;"
>

<button
  type="button"
  onclick="document.getElementById('jobseekerPhotoInput').click()"
  style="
    margin-top:15px;
    padding:10px 18px;
    background:#123b6d;
    color:white;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
  "
>
  ${language === "en" ? "Upload Photo" : "Upload Foto"}
</button>

          </div>

          <label>
            ${language === "en" ? "Full Name" : "Nama Lengkap"}
          </label>

          <input
            id="jobseekerFullName"
            type="text"
            placeholder="${language === "en" ? "Enter your full name" : "Masukkan nama lengkap"}"
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px;
              margin:8px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
            "
          >

          <label>
            ${language === "en" ? "Phone Number" : "Nomor Telepon"}
          </label>

          <input
            id="jobseekerPhone"
            type="text"
            placeholder="${language === "en" ? "Enter phone number" : "Masukkan nomor telepon"}"
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px;
              margin:8px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
            "
          >

          <label>
            ${language === "en" ? "City / Location" : "Kota / Domisili"}
          </label>

          <input
            id="jobseekerCity"
            type="text"
            placeholder="${language === "en" ? "Enter your city" : "Masukkan kota domisili"}"
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px;
              margin:8px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
            "
          >

          <label>
            ${language === "en" ? "Education" : "Pendidikan"}
          </label>

          <textarea
            id="jobseekerEducation"
            placeholder="${language === "en" ? "Your education" : "Pendidikan kamu"}"
            style="
              width:100%;
              box-sizing:border-box;
              min-height:90px;
              padding:12px;
              margin:8px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              resize:vertical;
            "
          ></textarea>

          <label>
            ${language === "en" ? "Work Experience" : "Pengalaman Kerja"}
          </label>

          <textarea
            id="jobseekerExperience"
            placeholder="${language === "en" ? "Your work experience" : "Pengalaman kerja kamu"}"
            style="
              width:100%;
              box-sizing:border-box;
              min-height:120px;
              padding:12px;
              margin:8px 0 18px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              resize:vertical;
            "
          ></textarea>

          <label>
            ${language === "en" ? "Skills" : "Keahlian"}
          </label>

          <textarea
            id="jobseekerSkills"
            placeholder="${language === "en" ? "Your skills" : "Keahlian kamu"}"
            style="
              width:100%;
              box-sizing:border-box;
              min-height:90px;
              padding:12px;
              margin:8px 0 25px;
              border:1px solid #dbe3ec;
              border-radius:8px;
              resize:vertical;
            "
          ></textarea>
                    <div style="
            margin:10px 0 25px;
            padding:18px;
            background:#f8fafc;
            border:1px solid #e5eaf1;
            border-radius:10px;
          ">
            <div style="
              font-weight:bold;
              color:#172b4d;
              margin-bottom:10px;
            ">
              📄 ${language === "en" ? "My CV" : "CV Saya"}
            </div>

            <div id="jobseekerCvDisplay">
              <span style="color:#6b7280;">
                ${language === "en"
                  ? "Checking your CV..."
                  : "Memeriksa CV kamu..."}
              </span>
            </div>
          </div>

          <button
            id="saveJobseekerProfileBtn"
            type="button"
            style="
              width:100%;
              padding:14px;
              background:#123b6d;
              color:white;
              border:none;
              border-radius:9px;
              cursor:pointer;
              font-size:16px;
              font-weight:bold;
            "
          >
            ${language === "en" ? "Save Profile" : "Simpan Profil"}
          </button>

        </div>
      </div>
    </div>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(dashboard);
  try {
    const response = await fetch(
      `${SUPABASE_URL}jobseeker_profiles?id=eq.${user.id}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (response.ok) {
      const profiles = await response.json();

      if (profiles.length > 0) {
        const profile = profiles[0];
        const profilePhoto = document.getElementById("jobseekerProfilePhoto");

if (profilePhoto && profile.photo_url) {
  profilePhoto.innerHTML = `
    <img
      src="${profile.photo_url}"
      alt="Profile Photo"
      style="
        width:100%;
        height:100%;
        object-fit:cover;
        border-radius:50%;
      "
    >
  `;
}

        document.getElementById("jobseekerFullName").value =
          profile.full_name || "";

        document.getElementById("jobseekerPhone").value =
          profile.phone || "";

        document.getElementById("jobseekerCity").value =
          profile.city || "";

        document.getElementById("jobseekerEducation").value =
          profile.education || "";

        document.getElementById("jobseekerExperience").value =
          profile.experience || "";

        document.getElementById("jobseekerSkills").value =
          profile.skills || "";
      const cvDisplay = document.getElementById("jobseekerCvDisplay");

if (cvDisplay) {
  if (profile.cv_url) {
    try {
      const cvPath = profile.cv_url.split("/object/public/cv/")[1];

      const signedResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1/object/sign/cv/")}${cvPath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            expiresIn: 31536000
          })
        }
      );

      if (!signedResponse.ok) {
        throw new Error(await signedResponse.text());
      }

      const signedData = await signedResponse.json();
      const signedUrl =
        `${SUPABASE_URL.replace("/rest/v1/", "/storage/v1")}${signedData.signedURL}`;
     
      cvDisplay.innerHTML = `
        <a
          href="${signedUrl}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display:inline-block;
            padding:10px 16px;
            background:#123b6d;
            color:white;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          📄 ${language === "en" ? "View My CV" : "Lihat CV Saya"}
        </a>
      `;
    } catch (error) {
      console.error("Gagal membuat URL CV:", error);

      cvDisplay.innerHTML = `
        <span style="color:#dc2626;">
          ${language === "en"
            ? "CV could not be opened."
            : "CV tidak dapat dibuka."}
        </span>
      `;
    }
  } else {
    cvDisplay.innerHTML = `
      <span style="color:#6b7280;">
        ${language === "en"
          ? "No CV uploaded yet."
          : "Belum ada CV yang diupload."}
    `;
  }
}
      }
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
  }


  // ================= UPLOAD FOTO PROFIL =================

  const photoInput = document.getElementById("jobseekerPhotoInput");

  if (photoInput) {
    photoInput.addEventListener("change", async () => {

      const file = photoInput.files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert(
          language === "en"
            ? "Please select an image file."
            : "Silakan pilih file gambar."
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(
          language === "en"
            ? "Photo size must not exceed 5 MB."
            : "Ukuran foto maksimal 5 MB."
        );
        return;
      }

      try {

        const fileExt = file.name.split(".").pop().toLowerCase();

        const filePath = `${user.id}.${fileExt}`;

        const uploadResponse = await fetch(
        `${SUPABASE_URL.replace("/rest/v1/", "/")}storage/v1/object/profile-photos/${filePath}`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": file.type,
             
            },
            body: file
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(await uploadResponse.text());
        }

       const photoUrl =
         `${SUPABASE_URL.replace("/rest/v1/", "/")}storage/v1/object/public/profile-photos/${filePath}`;

        const updateResponse = await fetch(
          `${SUPABASE_URL}jobseeker_profiles?id=eq.${user.id}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              photo_url: photoUrl,
              updated_at: new Date().toISOString()
            })
          }
        );

        if (!updateResponse.ok) {
          throw new Error(await updateResponse.text());
        }

        alert(
          language === "en"
            ? "Photo uploaded successfully."
            : "Foto berhasil diupload."
        );

        console.log("PHOTO URL:", photoUrl);

      } catch (error) {

        console.error("Gagal upload foto:", error);

        alert(
          language === "en"
            ? "Failed to upload photo."
            : "Gagal mengupload foto."
        );
      }
    });
  }


  const saveButton = document.getElementById("saveJobseekerProfileBtn");
  if (saveButton) {
    saveButton.addEventListener("click", async () => {

     const accessToken = localStorage.getItem("kerjivaAccessToken");
      if (!accessToken) {
        alert(
          language === "en"
            ? "Your session was not found. Please log in again."
            : "Sesi Anda tidak ditemukan. Silakan login kembali."
        );
        return;
      }

      const profileData = {
        id: user.id,
        full_name: document.getElementById("jobseekerFullName")?.value.trim() || "",
        phone: document.getElementById("jobseekerPhone")?.value.trim() || "",
        city: document.getElementById("jobseekerCity")?.value.trim() || "",
        education: document.getElementById("jobseekerEducation")?.value.trim() || "",
        experience: document.getElementById("jobseekerExperience")?.value.trim() || "",
        skills: document.getElementById("jobseekerSkills")?.value.trim() || "",
        updated_at: new Date().toISOString()
      };

      saveButton.disabled = true;
      saveButton.textContent =
        language === "en" ? "Saving..." : "Menyimpan...";

      try {
        const response = await fetch(
          `${SUPABASE_URL}jobseeker_profiles`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Prefer: "resolution=merge-duplicates,return=minimal"
            },
            body: JSON.stringify(profileData)
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

       alert(
           language === "en"
          ? "Profile saved successfully."
          : "Profil berhasil disimpan."
        );

        showJobseekerDashboard();
      } catch (error) {

        console.error("Gagal menyimpan profil:", error);

        alert(
          language === "en"
            ? "Failed to save profile."
            : "Gagal menyimpan profil."
        );

      } finally {

        saveButton.disabled = false;
        saveButton.textContent =
          language === "en" ? "Save Profile" : "Simpan Profil";
      }
    });
  }
}
// ================= LIHAT PASSWORD =================

const togglePassword =
  document.querySelector("#togglePassword");

const passwordInput =
  document.querySelector("#password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {

    const isHidden =
      passwordInput.type === "password";

    passwordInput.type =
      isHidden ? "text" : "password";

  togglePassword.textContent =
  isHidden ? "👁️" : "👁️‍🗨️";

    togglePassword.setAttribute(
      "aria-label",
      isHidden
        ? "Sembunyikan password"
        : "Tampilkan password"
    );

  });
}
  // ================= LIHAT PASSWORD BARU =================

const toggleNewPassword =
  document.querySelector("#toggleNewPassword");

const newPasswordInput =
  document.querySelector("#newPassword");

if (toggleNewPassword && newPasswordInput) {

  toggleNewPassword.addEventListener("click", () => {

    const isHidden =
      newPasswordInput.type === "password";

    newPasswordInput.type =
      isHidden ? "text" : "password";

    toggleNewPassword.textContent =
      isHidden ? "👁️" : "👁️‍🗨️";

  });

}

const toggleConfirmNewPassword =
  document.querySelector("#toggleConfirmNewPassword");

const confirmNewPasswordInput =
  document.querySelector("#confirmNewPassword");

if (
  toggleConfirmNewPassword &&
  confirmNewPasswordInput
) {

  toggleConfirmNewPassword.addEventListener("click", () => {

    const isHidden =
      confirmNewPasswordInput.type === "password";

    confirmNewPasswordInput.type =
      isHidden ? "text" : "password";

    toggleConfirmNewPassword.textContent =
      isHidden ? "👁️" : "👁️‍🗨️";

  });

}
  // ================= TAMPILKAN FORM PASSWORD BARU =================

function showResetPasswordForm() {

  const authModal =
    document.querySelector("#authModal");

  const forgotForm =
    document.querySelector("#forgotPasswordForm");

  const resetForm =
    document.querySelector("#resetPasswordForm");

  const forgotWrapper =
    document.querySelector("#forgotPasswordWrapper");

  const accountType =
    document.querySelector("#accountType");

  const jobseekerFields =
    document.querySelector("#jobseekerFields");

  const companyFields =
    document.querySelector("#companyFields");
  
  const emailField =
  document.querySelector("#email")?.parentElement;

const passwordField =
  document.querySelector("#password")?.closest("label");

  const confirmPasswordField =
    document.querySelector("#confirmPasswordField");

  const switchAuth =
    document.querySelector("#switchAuth")?.parentElement;

  const mainSubmit =
    authForm?.querySelector('button[type="submit"]');

  if (authModal) {
      authModal.classList.remove("hidden");
      authModal.style.display = "flex";
   }

  if (forgotWrapper) {
    forgotWrapper.style.display = "none";
  }

  if (forgotForm) {
    forgotForm.style.display = "none";
  }

  if (resetForm) {
    resetForm.style.display = "block";
  }

  if (accountType) {
    accountType.style.display = "none";
  }

  if (jobseekerFields) {
    jobseekerFields.style.display = "none";
  }

  if (companyFields) {
     companyFields.style.display = "none";
  }
  if (emailField) {
     emailField.style.display = "none";
  }

  if (passwordField) {
     passwordField.style.display = "none";
  }

  if (confirmPasswordField) {
       confirmPasswordField.style.display = "none";
  }

  if (switchAuth) {
    switchAuth.style.display = "none";
  }

  if (mainSubmit) {
    mainSubmit.style.display = "none";
  }

}
  // ================= SIMPAN PASSWORD BARU =================

const saveNewPasswordBtn =
  document.querySelector("#saveNewPasswordBtn");

if (saveNewPasswordBtn) {

  saveNewPasswordBtn.addEventListener("click", async () => {

    const newPassword =
      document.querySelector("#newPassword")?.value || "";

    const confirmNewPassword =
      document.querySelector("#confirmNewPassword")?.value || "";

    const language =
      localStorage.getItem("siteLanguage") || "id";

    if (!newPassword || !confirmNewPassword) {

      alert(
        language === "en"
          ? "Please fill in both password fields."
          : "Silakan isi kedua kolom password."
      );

      return;
    }

    if (newPassword.length < 6) {

      alert(
        language === "en"
          ? "Password must be at least 6 characters."
          : "Password minimal 6 karakter."
      );

      return;
    }

    if (newPassword !== confirmNewPassword) {

      alert(
        language === "en"
          ? "Passwords do not match."
          : "Password tidak sama."
      );

      return;
    }

    saveNewPasswordBtn.disabled = true;

    const originalText =
      saveNewPasswordBtn.textContent;

    saveNewPasswordBtn.textContent =
      language === "en"
        ? "Saving..."
        : "Menyimpan...";

    try {
const { data: sessionData, error: sessionError } =
  await supabaseAuth.auth.getSession();

if (sessionError) {
  console.error(
    "GET RECOVERY SESSION ERROR:",
    sessionError
  );
}

if (!sessionData?.session) {

  alert(
    language === "en"
      ? "Recovery session is no longer available. Please request a new reset link."
      : "Sesi pemulihan sudah tidak tersedia. Silakan minta link reset baru."
  );

  return;
}

const { error } =
  await supabaseAuth.auth.updateUser({
    password: newPassword
  });

      if (error) {

        console.error(
          "UPDATE PASSWORD ERROR:",
          error
        );

        alert(
          language === "en"
            ? "Failed to save new password: " + error.message
            : "Gagal menyimpan password baru: " + error.message
        );

        return;
      }

    alert(
  language === "en"
    ? "Password has been successfully changed."
    : "Password berhasil diubah."
);

document.querySelector("#newPassword").value = "";
document.querySelector("#confirmNewPassword").value = "";

// Tutup form reset password
const resetForm =
  document.querySelector("#resetPasswordForm");

const authModal =
  document.querySelector("#authModal");

if (resetForm) {
  resetForm.style.display = "none";
}

if (authModal) {
  authModal.classList.add("hidden");
  authModal.style.display = "none";
}

    } catch (error) {

      console.error(
        "UPDATE PASSWORD ERROR:",
        error
      );

      alert(
        language === "en"
          ? "An error occurred while changing the password."
          : "Terjadi kesalahan saat mengubah password."
      );

    } finally {

      saveNewPasswordBtn.disabled = false;
      saveNewPasswordBtn.textContent = originalText;

    }

  });

}
  // ================= DETEKSI RESET PASSWORD =================

const resetPasswordParam =
  new URLSearchParams(window.location.search).get("reset");

if (resetPasswordParam === "password") {

  console.log("RESET PASSWORD URL TERDETEKSI");

  showResetPasswordForm();

}

}

  
