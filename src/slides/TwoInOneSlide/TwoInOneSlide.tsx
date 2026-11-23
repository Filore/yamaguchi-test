import styles from './styles.module.css';
import { Badge } from '../../components/Badge/Badge';
import twoInOneHero from '../../assets/two-in-one-hero.png';
import twoInOneHeroDesktop from '../../assets/two-in-one-hero-desktop.png';


export function TwoInOneSlide(){
    return(
        <section className={styles['container']} aria-labelledby="two-in-one-title">
            <div className={styles['slide-card']}>
                <div className={styles['desktop-lights']} aria-hidden="true">
                    <span className={styles['light-top']} />
                    <span className={styles['light-left']} />
                    <span className={styles['light-right']} />
                </div>
                <img className={styles['background']} src={twoInOneHero} alt="" />
                <img className={styles['desktop-composition']} src={twoInOneHeroDesktop} alt="" />
                <div className={styles['content-wrapper']}>
                    <h1 id="two-in-one-title" className={styles['main-title']}>
                        ФЕН и СТАЙЛЕР<br />
                        в уникальном дизайне
                    </h1>

                    <Badge theme="light" className={styles['badge']}>
                        <span className={styles['badge-text']}>2 в 1</span>
                    </Badge>
                </div>

                <div className={styles['cards']}>
                    <div className={styles['fan-card']}>
                        <Badge theme="dark" className={styles['card-badge']}>
                            <span className={styles['card-badge-text']}>Фен</span>
                        </Badge>
                    </div>

                    <div className={styles['styler-card']}>
                        <Badge theme="light" className={styles['card-badge']}>
                            <span className={styles['card-badge-text']}>Стайлер</span>
                        </Badge>
                    </div>
                </div>
            </div>
        </section>
    )
}
