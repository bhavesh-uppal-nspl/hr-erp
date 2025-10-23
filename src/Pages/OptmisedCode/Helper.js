// 📂 src/utils/addOrg.js
import useAuthStore from "../../Zustand/Store/useAuthStore";

export const useAddOrgUrl = () => {
  const { userData } = useAuthStore();
  const organizationId = userData?.organization?.organization_id;

  let addorg = (url) => {
    let d = url.split("${org_id}");
    let finalurl = `${d[0]}${organizationId}${d[1]}`;
    return finalurl;
  };

  return addorg;
};


