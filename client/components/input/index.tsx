import style from './index.module.css';

export default function Input() {
  return (
    <input
      type="textbox"
      className={style.input}
      data-testid="location-textbox"
    ></input>
  );
}
