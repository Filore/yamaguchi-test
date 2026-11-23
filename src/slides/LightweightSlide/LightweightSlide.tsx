import styles from './styles.module.css';
import featherBadge from '../../assets/feather-badge.svg';
import lightweightHero from '../../assets/lightweight-hero.png';
import lightweightHeroDesktop from '../../assets/lightweight-hero-desktop.png';
import { Badge } from '../../components/Badge/Badge';
import { StarBadge } from '../../components/StarBadge/StarBadge';
import { BigBadge } from '../../components/BigBadge/BigBadge';


export function LightweightSlide(){
    return(
        <section className={styles['container']} aria-labelledby="lightweight-title">
            <div className={styles['slide-card']}>
                <div className={styles['mobile-feature']}>
                    <BigBadge icon={<img src={featherBadge} alt="" />}>
                        <span className={styles['badge-text']}>
                            лёгкость<br />
                            и комфорт<br />
                            в руке
                        </span>
                    </BigBadge>
                </div>

                <div className={styles['text-panel']}>
                    <h2 id="lightweight-title" className={styles['title']}>Супер<span className={styles['desktop-hyphen']}>-</span><span className={styles['title-ending']}>лёгкий</span></h2>

                    <div className={styles['description-wrapper']}>
                        <p className={styles['description']}>
                            Уменьшает усталость рук при сушке волос, делая процедуру
                            удобной и приятной даже после напряжённого рабочего дня.
                        </p>
                    </div>

                    <Badge theme="light" className={styles['badge']}>
                        <span className={styles['badge-text']}>500 г</span>
                    </Badge>
                </div>

                <div className={styles['image-wrapper']}>
                    <picture>
                        <source media="(min-width: 1024px)" srcSet={lightweightHeroDesktop} />
                        <img src={lightweightHero} alt="Девушка со стайлером и чашкой кофе" />
                    </picture>
                </div>

                <div className={styles['star-position']}>
                    <StarBadge>
                        Не тяжелее<br />
                        чашки кофе
                    </StarBadge>
                </div>

            </div>
            
        </section>
    )
}
