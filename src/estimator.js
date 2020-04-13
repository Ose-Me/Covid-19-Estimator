const getInfectionsByRequestedTime = (elapseTime, periodType, currentlyInfected) => {
    let value = elapseTime;
    if (periodType === 'weeks') {
      value *= 7;
    }
    if (periodType === 'months') {
      value *= 30;
    }
    const x = Math.trunc(value / 3);
    return currentlyInfected * (2 ** x);
  };
  
  const getHospitalBedsByRequestedTime = (x, y) => Math.trunc(0.35 * x - y);
  
  const getDollarsInFlight = (
    currentlyInf,
    avgIncome,
    avgIncomePop,
    daysInput,
    periodType
  ) => {
    let days = daysInput;
    if (periodType === 'weeks') {
      days *= 7;
    }
    if (periodType === 'months') {
      days *= 30;
    }
  
    const num = (currentlyInf * avgIncome * avgIncomePop) / days;
    return Math.floor(num);
  };
  
  
  const covid19ImpactEstimator = (data) => {
    const currentlyInfected = Math.trunc(data.reportedCases * 10);
    const severeCurrentlyInfected = data.reportedCases * 50;
    const impInfections = getInfectionsByRequestedTime(
      data.timeToElapse,
      data.periodType,
      currentlyInfected
    );
    const sevInfections = getInfectionsByRequestedTime(
      data.timeToElapse,
      data.periodType,
      severeCurrentlyInfected
    );
  
    const output = {
      data,
      impact: {
        currentlyInfected,
        infectionsByRequestedTime: Math.trunc(impInfections),
        severeCasesByRequestedTime: Math.trunc(0.15 * impInfections),
        hospitalBedsByRequestedTime: getHospitalBedsByRequestedTime(
          data.totalHospitalBeds,
          0.15 * impInfections
        ),
        casesForICUByRequestedTime: Math.trunc(0.05 * impInfections),
        casesForVentilatorsByRequestedTime: Math.trunc(0.02 * impInfections),
        dollarsInFlight: getDollarsInFlight(
          impInfections,
          data.region.avgDailyIncomeInUSD,
          data.region.avgDailyIncomePopulation,
          data.timeToElapse,
          data.periodType
        )
      },
      severeImpact: {
        currentlyInfected: Math.trunc(severeCurrentlyInfected),
        infectionsByRequestedTime: Math.trunc(sevInfections),
        severeCasesByRequestedTime: Math.trunc(0.15 * sevInfections),
        hospitalBedsByRequestedTime: getHospitalBedsByRequestedTime(
          data.totalHospitalBeds,
          0.15 * sevInfections
        ),
        casesForICUByRequestedTime: Math.trunc(0.05 * sevInfections),
        casesForVentilatorsByRequestedTime: Math.trunc(0.02 * sevInfections),
        dollarsInFlight: getDollarsInFlight(
          sevInfections,
          data.region.avgDailyIncomeInUSD,
          data.region.avgDailyIncomePopulation,
          data.timeToElapse,
          data.periodType
        )
      }
    };
    return output;
  };
  export default covid19ImpactEstimator;
  