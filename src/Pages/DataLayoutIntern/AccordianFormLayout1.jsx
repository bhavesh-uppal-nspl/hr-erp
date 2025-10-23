import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormSection from '../DataLayouts/FormSetion'
import useAuthStore from "../../Zustand/Store/useAuthStore";

import useInternDataStore from "../../Zustand/Store/useInternDataStore";

const AccordionFormLayout1 = ({ sections, mode }) => {
  const [expanded, setExpanded] = useState("Profile");
  const [internId, setInternId] = useState("");
  
  const { getDropdowndata, DropDownData, Employee } = useInternDataStore();
  const { userData } = useAuthStore();
  const org = userData?.organization;

  const accordionRefs = useRef({});

  useEffect(() => {
    getDropdowndata(org?.organization_id);
  }, [org]);
  const handleChange = (panelId) => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(panelId);

      // Wait for accordion to expand before scrolling
      setTimeout(() => {
        const el = accordionRefs.current[panelId];
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 200);
    } else {
      setExpanded("");
    }
  };

  return (
    <Box>
      {sections.map((section) => (
        <Accordion
          key={section.id}
          expanded={expanded === section.id}
          onChange={handleChange(section.id)}
          ref={(el) => (accordionRefs.current[section.id] = el)} 
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="h6"
              sx={{ fontSize: "15px", fontWeight: "bold" }}
            >
              {section.title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {expanded === section.id &&
              (section.customComponent ? (
                (() => {
                  const Component = section.customComponent;
                  return (
                    <Component
                      mode={mode}
                      internId={internId}
                      setInternId={setInternId}
                      organizationId={org?.organization_id}
                    />
                  );
                })()
              ) : (
                <FormSection fields={section.fields} apiUrl={section.apiUrl} />
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default AccordionFormLayout1;
