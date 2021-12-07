import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import tooltipAtom from 'src/recoils/tooltipAtom';

const useTooltip = () => {
  const [tooltip, setTooltip] = useRecoilState(tooltipAtom);

  const setTooltipHome = useCallback((isOn: boolean) => {
    setTooltip({
      ...tooltip,
      home: isOn,
    });
  }, [tooltip, setTooltip]);

  const setTooltipGallery = useCallback((isOn: boolean) => {
    setTooltip({
      ...tooltip,
      gallery: isOn,
    });
  }, [tooltip, setTooltip]);

  return { tooltip, setTooltipHome, setTooltipGallery };
};

export default useTooltip;
