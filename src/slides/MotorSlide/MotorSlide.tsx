import { BigBadge } from '../../components/BigBadge/BigBadge';
import { StarBadge } from '../../components/StarBadge/StarBadge';
import styles from './styles.module.css';
import engineBadge from '../../assets/engine-badge.svg';
import engine from '../../assets/engine.png';
import engineDesktop from '../../assets/engine-desktop.png';


export function MotorSlide(){
    return(
        <section className={styles['container']} aria-labelledby="motor-title">
            <div className={styles['slide-card']}>
                <div className={styles['mobile-feature']}>
                    <BigBadge icon={<img src={engineBadge} alt="" />}>
                        <span className={styles['badge-text']}>
                            инновационный   
                            <br /> 
                            японский мотор
                        </span>
                    </BigBadge>
                </div>

                <h2 id="motor-title" className={styles['heading-text']}>
                    <span className={styles['heading-line']}>
                        <span className={styles['first-line-text']}>Для ценителей</span>{' '}
                        <span className={styles['comfort']}>комфорта</span>
                    </span>{' '}
                    <span className={styles['heading-line']}>
                        <span className={styles['quality']}>и качества</span>{' '}
                        <span className={styles['third-line-text']}>в уходе за волосами</span>
                    </span>
                </h2>

                <div className={styles['img-wrapper']}>
                    <div className={styles['image-content']}>
                        <picture>
                            <source media="(min-width: 1024px)" srcSet={engineDesktop} />
                            <img src={engine} alt="Бесщеточный мотор BLDC" />
                        </picture>
                        <p className={styles['image-label']}>
                            Бесщеточный<br className={styles['mobile-break']} />
                            <span className={styles['desktop-space']}>
                                {' '}
                            </span>
                            мотор BLDC
                        </p>
                        <div className={styles['star-position']}>
                            <StarBadge textRotation={0}>
                                Салонная
                                <br />
                                мощность
                            </StarBadge>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
