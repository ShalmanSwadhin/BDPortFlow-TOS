import svgPaths from "./svg-1rcp9lhow4";
import clsx from "clsx";

function Container21({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">{children}</div>
    </div>
  );
}

function Container20({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[16px] relative shrink-0 w-[22.766px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type Container19Props = {
  additionalClassNames?: string;
};

function Container19({ children, additionalClassNames = "" }: React.PropsWithChildren<Container19Props>) {
  return (
    <div className={clsx("h-[36px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">{children}</div>
    </div>
  );
}

function Container18({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">{children}</div>
    </div>
  );
}

function Icon3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}
type ContainerText4Props = {
  text: string;
};

function ContainerText4({ text }: ContainerText4Props) {
  return (
    <div className="h-[16px] relative shrink-0 w-full">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[-0.5px] not-italic text-[#90a1b9] text-[12px] top-[-1px] w-[79px]">{text}</p>
    </div>
  );
}
type ContainerText3Props = {
  text: string;
};

function ContainerText3({ text }: ContainerText3Props) {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#e2e8f0] text-[14px] text-nowrap">{text}</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="basis-0 grow h-[62px] min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}
type ContainerText2Props = {
  text: string;
};

function ContainerText2({ text }: ContainerText2Props) {
  return (
    <div className="absolute bg-[rgba(0,188,125,0.2)] content-stretch flex h-[24px] items-start left-0 px-[8px] py-[4px] rounded-[4px] top-[44px] w-[64.219px]">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#00d492] text-[12px] text-nowrap">{text}</p>
    </div>
  );
}
type ContainerText1Props = {
  text: string;
};

function ContainerText1({ text }: ContainerText1Props) {
  return (
    <div className="absolute h-[16px] left-0 top-[24px] w-[144px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] top-[-1px] w-[68px]">{text}</p>
    </div>
  );
}
type ContainerTextProps = {
  text: string;
};

function ContainerText({ text }: ContainerTextProps) {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[144px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#e2e8f0] text-[14px] top-[-2px] w-[51px]">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full", additionalClassNames)}>
      <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-center">{text}</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[#f1f5f9] text-[20px]">Berth Schedule Timeline</p>
    </div>
  );
}

function Container() {
  return <div className="h-[20px] shrink-0 w-[160px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <Text text="00:00" />
    </div>
  );
}

function Container2() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="02:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container3() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="04:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="06:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container5() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="08:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="10:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="12:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="14:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container9() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="16:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container10() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="18:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container11() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="20:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container12() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text text="22:00" additionalClassNames="pl-px pr-0 py-0" />
    </div>
  );
}

function Container13() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Container1 />
        <Container2 />
        <Container3 />
        <Container4 />
        <Container5 />
        <Container6 />
        <Container7 />
        <Container8 />
        <Container9 />
        <Container10 />
        <Container11 />
        <Container12 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-0 w-[1200px]" data-name="Container">
      <Container />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[68px] left-0 top-0 w-[160px]" data-name="Container">
      <ContainerText text="Berth 1" />
      <ContainerText1 text="300m × 15m" />
      <ContainerText2 text="occupied" />
    </div>
  );
}

function Container16() {
  return <div className="basis-0 grow h-[62px] min-h-px min-w-px shrink-0" data-name="Container" />;
}

function Container22() {
  return (
    <div className="absolute content-stretch flex h-[62px] items-start left-0 pl-0 pr-[0.063px] py-0 top-0 w-[1038px]" data-name="Container">
      <Container16 />
      {[...Array(11).keys()].map((_, i) => (
        <Container17 />
      ))}
    </div>
  );
}

function Icon() {
  return (
    <Icon3>
      <g clipPath="url(#clip0_261_219)" id="Icon">
        <path d="M8 6.79266V9.33333" id="Vector" stroke="var(--stroke-0, #00FF88)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d="M8 1.33333V3.33333" id="Vector_2" stroke="var(--stroke-0, #00FF88)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p183c7940} id="Vector_3" stroke="var(--stroke-0, #00FF88)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p31f45900} id="Vector_4" stroke="var(--stroke-0, #00FF88)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p3f202e00} id="Vector_5" stroke="var(--stroke-0, #00FF88)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      </g>
      <defs>
        <clipPath id="clip0_261_219">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </Icon3>
  );
}

function Container23() {
  return (
    <Container18>
      <ContainerText3 text="MV HARMONY" />
      <ContainerText4 text="14:30 - 18:00" />
    </Container18>
  );
}

function Container24() {
  return (
    <Container19 additionalClassNames="w-[117.797px]">
      <Icon />
      <Container23 />
    </Container19>
  );
}

function Container25() {
  return (
    <Container20>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[-5.92px] not-italic text-[#0f8] text-[12px] top-[-1px] w-[29px]">65%</p>
    </Container20>
  );
}

function Container26() {
  return (
    <Container21>
      <Container24 />
      <Container25 />
    </Container21>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[rgba(0,255,136,0.25)] content-stretch flex h-[62px] items-center left-[259.5px] pl-[15px] pr-[12px] py-0 rounded-[4px] top-0 w-[415.188px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#0f8] border-[0px_0px_0px_3px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[rgba(29,41,61,0.3)] border border-[#1d293d] border-solid h-[64px] left-[160px] rounded-[10px] top-[2px] w-[1040px]" data-name="Container">
      <Container22 />
      <Container27 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[68px] left-0 top-[36px] w-[1200px]" data-name="Container">
      <Container15 />
      <Container28 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[68px] left-0 top-0 w-[160px]" data-name="Container">
      <ContainerText text="Berth 2" />
      <ContainerText1 text="380m × 16m" />
      <ContainerText2 text="occupied" />
    </div>
  );
}

function Container31() {
  return <div className="basis-0 grow h-[62px] min-h-px min-w-px shrink-0" data-name="Container" />;
}

function Container32() {
  return (
    <div className="absolute content-stretch flex h-[62px] items-start left-0 pl-0 pr-[0.063px] py-0 top-0 w-[1038px]" data-name="Container">
      <Container31 />
      {[...Array(11).keys()].map((_, i) => (
        <Container17 />
      ))}
    </div>
  );
}

function Icon1() {
  return (
    <Icon3>
      <g clipPath="url(#clip0_261_212)" id="Icon">
        <path d="M8 6.79268V9.33335" id="Vector" stroke="var(--stroke-0, #00D4FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d="M8 1.33333V3.33333" id="Vector_2" stroke="var(--stroke-0, #00D4FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p183c7940} id="Vector_3" stroke="var(--stroke-0, #00D4FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p32b49e00} id="Vector_4" stroke="var(--stroke-0, #00D4FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p3f202e00} id="Vector_5" stroke="var(--stroke-0, #00D4FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      </g>
      <defs>
        <clipPath id="clip0_261_212">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </Icon3>
  );
}

function Container33() {
  return (
    <Container18>
      <ContainerText3 text="MSC AURORA" />
      <ContainerText4 text="16:00 - 22:00" />
    </Container18>
  );
}

function Container34() {
  return (
    <Container19 additionalClassNames="w-[111.094px]">
      <Icon1 />
      <Container33 />
    </Container19>
  );
}

function Container35() {
  return (
    <Container20>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[-3.92px] not-italic text-[#00d4ff] text-[12px] top-[-1px] w-[27px]">45%</p>
    </Container20>
  );
}

function Container36() {
  return (
    <Container21>
      <Container34 />
      <Container35 />
    </Container21>
  );
}

function Container37() {
  return (
    <div className="absolute bg-[rgba(0,212,255,0.25)] content-stretch flex h-[62px] items-center left-[259.5px] pl-[15px] pr-[12px] py-0 rounded-[4px] top-0 w-[415.188px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#00d4ff] border-[0px_0px_0px_3px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container36 />
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-[rgba(29,41,61,0.3)] border border-[#1d293d] border-solid h-[64px] left-[160px] rounded-[10px] top-[2px] w-[1040px]" data-name="Container">
      <Container32 />
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute h-[68px] left-0 top-[116px] w-[1200px]" data-name="Container">
      <Container30 />
      <Container38 />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute h-[16px] left-0 top-[24px] w-[144px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[11px] top-[-1px] w-[77px]">350m × 15.5m</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[68px] left-0 top-0 w-[160px]" data-name="Container">
      <ContainerText text="Berth 3" />
      <Container40 />
      <ContainerText2 text="occupied" />
    </div>
  );
}

function Container42() {
  return <div className="basis-0 grow h-[62px] min-h-px min-w-px shrink-0" data-name="Container" />;
}

function Container43() {
  return (
    <div className="absolute content-stretch flex h-[62px] items-start left-0 pl-0 pr-[0.063px] py-0 top-0 w-[1038px]" data-name="Container">
      <Container42 />
      {[...Array(11).keys()].map((_, i) => (
        <Container17 />
      ))}
    </div>
  );
}

function Icon2() {
  return (
    <Icon3>
      <g clipPath="url(#clip0_261_205)" id="Icon">
        <path d="M8 6.79268V9.33335" id="Vector" stroke="var(--stroke-0, #FFD700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d="M8 1.33333V3.33333" id="Vector_2" stroke="var(--stroke-0, #FFD700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p183c7940} id="Vector_3" stroke="var(--stroke-0, #FFD700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p32b49e00} id="Vector_4" stroke="var(--stroke-0, #FFD700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p3f202e00} id="Vector_5" stroke="var(--stroke-0, #FFD700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      </g>
      <defs>
        <clipPath id="clip0_261_205">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </Icon3>
  );
}

function Container44() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[-0.5px] not-italic text-[#90a1b9] text-[12px] top-[-1px] w-[85px]">09:00 - 15:00</p>
    </div>
  );
}

function Container45() {
  return (
    <Container18>
      <ContainerText3 text="MAERSK LIBERTY" />
      <Container44 />
    </Container18>
  );
}

function Container46() {
  return (
    <Container19 additionalClassNames="w-[128.969px]">
      <Icon2 />
      <Container45 />
    </Container19>
  );
}

function Container47() {
  return (
    <Container20>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[-5.92px] not-italic text-[#ffd700] text-[12px] top-[-1px] w-[29px]">85%</p>
    </Container20>
  );
}

function Container48() {
  return (
    <Container21>
      <Container46 />
      <Container47 />
    </Container21>
  );
}

function Container49() {
  return (
    <div className="absolute bg-[rgba(255,215,0,0.25)] content-stretch flex h-[62px] items-center left-[259.5px] pl-[15px] pr-[12px] py-0 rounded-[4px] top-0 w-[415.188px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffd700] border-[0px_0px_0px_3px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute bg-[rgba(29,41,61,0.3)] border border-[#1d293d] border-solid h-[64px] left-[160px] rounded-[10px] top-[2px] w-[1040px]" data-name="Container">
      <Container43 />
      <Container49 />
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute h-[68px] left-0 top-[196px] w-[1200px]" data-name="Container">
      <Container41 />
      <Container50 />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute bg-[#314158] content-stretch flex h-[24px] items-start left-0 px-[8px] py-[4px] rounded-[4px] top-[44px] w-[62.125px]" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#90a1b9] text-[12px] text-nowrap">available</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute h-[68px] left-0 top-0 w-[160px]" data-name="Container">
      <ContainerText text="Berth 4" />
      <ContainerText1 text="320m × 14m" />
      <Container52 />
    </div>
  );
}

function Container54() {
  return <div className="basis-0 grow h-[62px] min-h-px min-w-px shrink-0" data-name="Container" />;
}

function Container55() {
  return (
    <div className="h-[62px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pl-0 pr-[0.063px] py-0 relative size-full">
        <Container54 />
        {[...Array(11).keys()].map((_, i) => (
          <Container17 />
        ))}
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute bg-[rgba(29,41,61,0.3)] content-stretch flex flex-col h-[64px] items-start left-[160px] p-px rounded-[10px] top-[2px] w-[1040px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#1d293d] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container55 />
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute h-[68px] left-0 top-[276px] w-[1200px]" data-name="Container">
      <Container53 />
      <Container56 />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute bg-[rgba(255,105,0,0.2)] content-stretch flex h-[24px] items-start left-0 px-[8px] py-[4px] rounded-[4px] top-[44px] w-[84px]" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#ff8904] text-[12px] text-nowrap">maintenance</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[68px] left-0 top-0 w-[160px]" data-name="Container">
      <ContainerText text="Berth 5" />
      <ContainerText1 text="280m × 13m" />
      <Container58 />
    </div>
  );
}

function Container60() {
  return <div className="basis-0 grow h-[62px] min-h-px min-w-px shrink-0" data-name="Container" />;
}

function Container61() {
  return (
    <div className="absolute content-stretch flex h-[62px] items-start left-0 pl-0 pr-[0.063px] py-0 top-0 w-[1038px]" data-name="Container">
      <Container60 />
      {[...Array(11).keys()].map((_, i) => (
        <Container17 />
      ))}
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#ff8904] text-[14px] text-nowrap">Maintenance</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute bg-[rgba(255,105,0,0.2)] content-stretch flex h-[62px] items-center left-[519px] pl-[14px] pr-0 py-0 rounded-[4px] top-0 w-[311.391px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ff6900] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container62 />
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute bg-[rgba(29,41,61,0.3)] border border-[#1d293d] border-solid h-[64px] left-[160px] rounded-[10px] top-[2px] w-[1040px]" data-name="Container">
      <Container61 />
      <Container63 />
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute h-[68px] left-0 top-[356px] w-[1200px]" data-name="Container">
      <Container59 />
      <Container64 />
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[424px] relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container29 />
      <Container39 />
      <Container51 />
      <Container57 />
      <Container65 />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col h-[436px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <Container66 />
    </div>
  );
}

export default function Container68() {
  return (
    <div className="bg-[rgba(15,23,43,0.5)] content-stretch flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px] relative rounded-[14px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#1d293d] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading />
      <Container67 />
    </div>
  );
}