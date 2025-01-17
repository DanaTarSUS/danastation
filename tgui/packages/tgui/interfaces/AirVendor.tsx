/**
 * @file
 * @copyright 2023
 * @author Original Garash (https://github.com/Garash2k)
 * @author Changes Sovexe (https://github.com/Sovexe)
 * @license ISC
 */

import { useBackend } from "../backend";
import { Button, Dimmer, LabeledList, Section, Slider, Stack } from "../components";
import { Window } from '../layouts';
import { VendorCashTable } from './common/VendorCashTable';
import { GasTankInfo } from './GasTank';

type AirVendorParams = {
  cash: number,
  cardname: string,
  bankMoney: number,
  vend_type: string,
  holding: string,
  holding_pressure: number,
  min_pressure: number,
  max_pressure: number,
  air_cost: number,
  fill_cost: number,
  target_pressure: number,
  current_fill: number
}

const VendorSection = (_props, context) => {
  const { act, data } = useBackend<AirVendorParams>(context);
  const {
    air_cost,
    bankMoney,
    cash,
    current_fill,
    fill_cost,
    max_pressure,
    min_pressure,
    target_pressure,
    vend_type,
  } = data;

  const handleFillClick = () => act('o2_fill');
  const handleChangePressure = (pressure: number) => act('o2_changepressure', { pressure: pressure });

  const isFree = !air_cost;
  const canVend = isFree || (fill_cost > 0 && (bankMoney > fill_cost || cash > fill_cost));

  return (
    <Section title={`Buy ${vend_type}!`}>
      <LabeledList>
        <LabeledList.Item label="Cost">
          <Button
            content={isFree ? 'Free!' : `${fill_cost || 0}⪽`}
            color={canVend ? "green" : "grey"}
            disabled={!canVend}
            onClick={handleFillClick} />
        </LabeledList.Item>
        <LabeledList.Item label="Pressure">
          <Stack>
            <Stack.Item>
              <Button
                disabled={target_pressure === min_pressure}
                onClick={() => handleChangePressure(min_pressure)}
                content="Min" />
            </Stack.Item>
            <Stack.Item grow>
              <Slider
                value={target_pressure}
                fillValue={Math.min(current_fill, max_pressure)}
                minValue={min_pressure}
                maxValue={max_pressure}
                step={10}
                stepPixelSize={4}
                onChange={(_e: any, value: number) => handleChangePressure(value)}
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                disabled={target_pressure === max_pressure}
                onClick={() => handleChangePressure(max_pressure)}
                content="Max" />
            </Stack.Item>
          </Stack>
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};

const TankSection = (_props, context) => {
  const { act, data } = useBackend<AirVendorParams>(context);
  const { holding, holding_pressure, max_pressure } = data;

  const handleTankEject = () => act('o2_eject');
  const handleTankInsert = () => act('o2_insert');

  return (
    <Section title={"Holding Tank"} buttons={
      <Button onClick={handleTankEject} icon="eject" disabled={!holding}>Eject</Button>
    }>
      <GasTankInfo pressure={holding_pressure || 0} maxPressure={max_pressure || 1} name={holding || "N/A"} />
      {!holding && (
        <Dimmer>
          <Button
            icon="eject"
            fontSize={1.5}
            onClick={handleTankInsert}
            bold>
            Insert Gas Tank
          </Button>
        </Dimmer>
      )}
    </Section>
  );
};

export const AirVendor = (_props, context) => {
  const { act, data } = useBackend<AirVendorParams>(context);
  const { cash, cardname, bankMoney } = data;

  const handleCardEject = () => act('logout');
  const handleCashEject = () => act('returncash');

  return (
    <Window
      width={350}
      height={320}>
      <Window.Content>
        <VendorSection />
        <TankSection />
        <VendorCashTable cardname={cardname} onCardClick={handleCardEject} bankMoney={bankMoney}
          cash={cash} onCashClick={handleCashEject} />
      </Window.Content>
    </Window>
  );
};
