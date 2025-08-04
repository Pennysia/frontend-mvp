'use client'

import React from 'react'
import Image from 'next/image'

function FeatureCards() {
    return (
        <div>
            <h3 className="text-3xl md:text-4xl font-base text-[#2E2F46] dark:text-white mb-4 text-center pt-24 mb-24">
                Build markets with ease. Directed by your conviction.
            </h3>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 px-4 sm:px-0">
                {/* Card 1 */}
                <div className="p-6 bg-transparent rounded-2xl text-left border border-gray-300 dark:border-gray-800">
                    <div className="w-full h-auto mx-auto my-2 flex items-center justify-center">
                        <div className="w-full h-50 my-8 flex items-center justify-center transform-gpu">
                            <Image
                                src="/homePage/rc1.svg"
                                alt="Pennysia Logo"
                                width={300}
                                height={300}
                                className="w-full h-auto sm:max-w-[320px] md:max-w-[381px]"
                                objectFit="contain"
                                priority={true}
                                quality={100}
                            />
                        </div>
                    </div>
                    <h3 className="pt-6 text-2xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                        Lifetime Passive <br />
                        <span className="bg-gradient-to-b from-[#2E2F46] to-[#2E2F46]/50 dark:from-white dark:to-[#555C6F]/50 text-transparent bg-clip-text block">
                            Income Generator
                        </span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-medium transition-colors duration-300">
                        A true lifetime passive income generator. Provide liquidity, and it's all done. Your crypto will work for you.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="p-6 bg-transparent rounded-2xl text-left border border-gray-300 dark:border-gray-800">
                    <div className="w-full h-auto mx-auto my-2 flex items-center justify-center">
                        <div className="w-full h-auto mx-auto my-8 flex items-center justify-center transform-gpu">
                            <Image
                                src="/homePage/rc2.svg"
                                alt="Pennysia Logo"
                                width={280}
                                height={280}
                                className="w-full h-auto sm:max-w-[250px] md:max-w-[280px]"
                                objectFit="contain"
                                priority={true}
                                quality={100}
                            />
                        </div>
                    </div>
                    <h3 className="pt-6 text-2xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                        Bidirectional <br />
                        <span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 dark:from-white dark:to-[#555C6F]/50 text-transparent bg-clip-text block">
                            Liquidity Prediction
                        </span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-medium transition-colors duration-300">
                        Predict market movements with your liquidity positions
                        to maximize returns. Your conviction, your rewards.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="p-6 bg-transparent rounded-2xl text-left border border-gray-300 dark:border-gray-800">
                    <div className="w-full h-auto mx-auto my-2 flex items-center justify-center">
                        <div className="w-full h-auto mx-auto my-8 flex items-center justify-center transform-gpu">
                            <Image
                                src="/homePage/rc3.svg"
                                alt="Pennysia Logo"
                                width={280}
                                height={280}
                                className="w-full h-auto sm:max-w-[250px] md:max-w-[280px]"
                                objectFit="contain"
                                priority={true}
                                quality={100}
                            />
                        </div>
                    </div>
                    <h3 className="pt-6 text-2xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                        Decentralized and <br />
                        <span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 dark:from-white dark:to-[#555C6F]/50 text-transparent bg-clip-text block">
                            Automated Markets
                        </span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-medium transition-colors duration-300">
                        No human intervention. Rewards are auto-compounded.
                        Accessible worldwide to everyone.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default React.memo(FeatureCards)
